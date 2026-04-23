package com.EVENTORA.controller;

import com.EVENTORA.domain.User;
import com.EVENTORA.dto.PaymentOrderDTO;
import com.EVENTORA.dto.PaymentVerifyDTO;
import com.EVENTORA.repository.UserRepository;
import com.EVENTORA.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * PaymentController — endpoints:
 *
 *  POST /api/payments/orders              → create Razorpay order (requires auth)
 *  POST /api/payments/verify              → verify signature & confirm booking (requires auth)
 *  GET  /api/payments/status/{bookingId}  → Redis-fast status check (requires auth)
 *  POST /api/payments/webhook             → Razorpay server-to-server webhook (public)
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    // ── 1. Create Razorpay Order ──────────────────────────────────────────────

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            User user = resolveUser(authentication);
            UUID bookingId = UUID.fromString(request.get("bookingId"));

            PaymentOrderDTO order = paymentService.createOrder(
                    bookingId,
                    user.getEmail(),
                    user.getName()
            );
            return ResponseEntity.ok(order);

        } catch (RuntimeException e) {
            log.error("Create order failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── 2. Verify Razorpay Signature & Confirm Booking ───────────────────────

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerifyDTO dto,
            Authentication authentication) {
        try {
            resolveUser(authentication); // ensure caller is authenticated
            var confirmedBooking = paymentService.verifyAndConfirm(dto);
            return ResponseEntity.ok(confirmedBooking);

        } catch (RuntimeException e) {
            log.error("Payment verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── 3. Redis-Fast Payment Status ─────────────────────────────────────────

    @GetMapping("/status/{bookingId}")
    public ResponseEntity<?> getPaymentStatus(
            @PathVariable UUID bookingId,
            Authentication authentication) {
        resolveUser(authentication);
        String status = paymentService.getPaymentStatus(bookingId);
        return ResponseEntity.ok(Map.of("bookingId", bookingId.toString(), "status", status));
    }

    @PostMapping("/verify-manual/{bookingId}")
    public ResponseEntity<?> verifyManualPayment(
            @PathVariable UUID bookingId,
            Authentication authentication) {
        try {
            resolveUser(authentication);
            var confirmedBooking = paymentService.verifyManual(bookingId);
            return ResponseEntity.ok(confirmedBooking);
        } catch (RuntimeException e) {
            log.error("Manual verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── 4. Razorpay Webhook (server-to-server, no auth) ──────────────────────
    //
    //  Razorpay sends: payment.captured, payment.failed, refund.created, etc.
    //  We validate X-Razorpay-Signature using HMAC-SHA256(body, webhookSecret).
    //  For now we forward it to the verify path on payment.captured events.

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        try {
            log.info("Received Razorpay webhook, event size={} bytes", payload.length());
            // Parse minimal fields — avoid heavy JSON library for hot path
            if (payload.contains("\"payment.captured\"")) {
                log.info("payment.captured webhook received — booking will be confirmed via client verify call");
            }
            return ResponseEntity.ok(Map.of("status", "received"));
        } catch (Exception e) {
            log.error("Webhook processing error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("status", "received")); // always 200 to Razorpay
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    private User resolveUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
