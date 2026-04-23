package com.EVENTORA.service;

import com.EVENTORA.domain.Booking;
import com.EVENTORA.dto.BookingDTO;
import com.EVENTORA.dto.PaymentOrderDTO;
import com.EVENTORA.dto.PaymentVerifyDTO;
import com.EVENTORA.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HexFormat;
import java.util.UUID;

/**
 * PaymentService wires Redis + Razorpay together:
 *
 *  1. createOrder()       → creates a Razorpay order, caches it in Redis (TTL = 15 min)
 *  2. verifyAndConfirm()  → verifies HMAC signature, confirms booking, purges Redis entry
 *  3. refund()            → (future) triggers Razorpay refund, marks booking REFUNDED
 *
 * Redis keys:
 *   payment:order:{razorpayOrderId}  → bookingId   (TTL 15 min)
 *   payment:status:{bookingId}       → PENDING / SUCCESS / FAILED (TTL 30 min)
 */
@Service
@Slf4j
public class PaymentService {

    private static final String ORDER_KEY_PREFIX  = "payment:order:";
    private static final String STATUS_KEY_PREFIX = "payment:status:";
    private static final Duration ORDER_TTL  = Duration.ofMinutes(15);
    private static final Duration STATUS_TTL = Duration.ofMinutes(30);

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    public PaymentService(BookingRepository bookingRepository,
                          BookingService bookingService,
                          RedisTemplate<String, String> redisTemplate) {
        this.bookingRepository = bookingRepository;
        this.bookingService    = bookingService;
        this.redisTemplate     = redisTemplate;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  1. Create Razorpay order & cache in Redis
    // ─────────────────────────────────────────────────────────────────────────

    public PaymentOrderDTO createOrder(UUID bookingId, String userEmail, String userName) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is not in PENDING state. Current: " + booking.getStatus());
        }

        // Check if we already have a cached order for idempotency
        String existingOrderId = (String) redisTemplate.opsForHash()
                .get(STATUS_KEY_PREFIX + bookingId, "orderId");
        if (existingOrderId != null) {
            log.info("Returning cached Razorpay order for booking {}", bookingId);
            return buildPaymentOrderDTO(booking, existingOrderId, userEmail, userName);
        }

        // Amount in paise (1 INR = 100 paise)
        long amountInPaise = booking.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", booking.getBookingReference());
            orderRequest.put("payment_capture", 1); // auto-capture

            Order razorpayOrder = client.orders.create(orderRequest);
            String orderId = razorpayOrder.get("id");

            log.info("Created Razorpay order {} for booking {}", orderId, bookingId);

            // ── Cache in Redis ──────────────────────────────────────────────
            // 1. order_id → booking_id  (for webhook lookup)
            redisTemplate.opsForValue()
                    .set(ORDER_KEY_PREFIX + orderId, bookingId.toString(), ORDER_TTL);

            // 2. booking status hash
            redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "status",  "PENDING");
            redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "orderId", orderId);
            redisTemplate.expire(STATUS_KEY_PREFIX + bookingId, ORDER_TTL);

            return buildPaymentOrderDTO(booking, orderId, userEmail, userName);

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for booking {}: {}", bookingId, e.getMessage());
            throw new RuntimeException("Payment gateway error: " + e.getMessage(), e);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  2. Verify HMAC-SHA256 signature & confirm booking
    // ─────────────────────────────────────────────────────────────────────────

    public BookingDTO verifyAndConfirm(PaymentVerifyDTO dto) {
        // Signature = HMAC-SHA256(orderId + "|" + paymentId, keySecret)
        String expectedSignature = hmacSha256(
                dto.getRazorpayOrderId() + "|" + dto.getRazorpayPaymentId(),
                razorpayKeySecret
        );

        if (!expectedSignature.equals(dto.getRazorpaySignature())) {
            log.error("Signature mismatch for order {}", dto.getRazorpayOrderId());
            // Mark as FAILED in Redis
            String cachedBookingId = redisTemplate.opsForValue().get(ORDER_KEY_PREFIX + dto.getRazorpayOrderId());
            if (cachedBookingId != null) {
                redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + cachedBookingId, "status", "FAILED");
            }
            throw new RuntimeException("Payment signature verification failed");
        }

        // Resolve booking from Redis or DTO
        UUID bookingId;
        try {
            bookingId = UUID.fromString(dto.getBookingId());
        } catch (Exception e) {
            String cached = redisTemplate.opsForValue().get(ORDER_KEY_PREFIX + dto.getRazorpayOrderId());
            if (cached == null) throw new RuntimeException("Cannot resolve booking from order " + dto.getRazorpayOrderId());
            bookingId = UUID.fromString(cached);
        }

        // Confirm booking in DB
        Booking confirmed = bookingService.confirmBooking(bookingId);

        // Update Redis payment status → SUCCESS
        redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "status",    "SUCCESS");
        redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "paymentId", dto.getRazorpayPaymentId());
        redisTemplate.expire(STATUS_KEY_PREFIX + bookingId, STATUS_TTL);

        // Clean up order key (no longer needed for lookup)
        redisTemplate.delete(ORDER_KEY_PREFIX + dto.getRazorpayOrderId());

        log.info("Payment SUCCESS — booking {} confirmed, paymentId {}", bookingId, dto.getRazorpayPaymentId());
        return toDTO(confirmed);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  2b. Verify Manual Payment (UPI QR)
    // ─────────────────────────────────────────────────────────────────────────

    public BookingDTO verifyManual(UUID bookingId) {
        Booking confirmed = bookingService.confirmBooking(bookingId);
        redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "status", "SUCCESS");
        redisTemplate.opsForHash().put(STATUS_KEY_PREFIX + bookingId, "paymentId", "manual_upi_" + UUID.randomUUID().toString().substring(0, 8));
        redisTemplate.expire(STATUS_KEY_PREFIX + bookingId, STATUS_TTL);
        log.info("Manual Payment SUCCESS — booking {} confirmed", bookingId);
        return toDTO(confirmed);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  3. Get cached payment status from Redis (fast path, no DB hit)
    // ─────────────────────────────────────────────────────────────────────────

    public String getPaymentStatus(UUID bookingId) {
        Object status = redisTemplate.opsForHash().get(STATUS_KEY_PREFIX + bookingId, "status");
        if (status != null) return status.toString();
        // Fallback to DB
        return bookingRepository.findById(bookingId)
                .map(Booking::getStatus)
                .orElse("NOT_FOUND");
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private PaymentOrderDTO buildPaymentOrderDTO(Booking booking, String orderId, String email, String name) {
        long paise = booking.getTotalPrice().multiply(BigDecimal.valueOf(100)).longValue();
        return PaymentOrderDTO.builder()
                .orderId(orderId)
                .bookingId(booking.getId().toString())
                .bookingReference(booking.getBookingReference())
                .amount(booking.getTotalPrice())
                .amountInPaise(paise)
                .currency("INR")
                .razorpayKeyId(razorpayKeyId)
                .eventTitle(booking.getEvent().getTitle())
                .customerName(name)
                .customerEmail(email)
                .build();
    }

    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC computation failed", e);
        }
    }

    private BookingDTO toDTO(Booking booking) {
        java.util.List<String> seatNumbers = booking.getBookingSeats() == null
                ? java.util.List.of()
                : booking.getBookingSeats().stream()
                        .map(bs -> bs.getSeat().getSeatNumber())
                        .toList();

        return BookingDTO.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .eventTitle(booking.getEvent().getTitle())
                .eventCity(booking.getEvent().getCity())
                .eventVenue(booking.getEvent().getVenue())
                .eventDate(booking.getEvent().getEventDate())
                .bannerImageUrl(booking.getEvent().getBannerImageUrl())
                .totalSeats(booking.getTotalSeats())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .seatNumbers(seatNumbers)
                .qrHash(booking.getQrHash())
                .expiresAt(booking.getExpiresAt())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
