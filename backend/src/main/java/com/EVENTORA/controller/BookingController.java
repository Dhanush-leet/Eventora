package com.EVENTORA.controller;

import com.EVENTORA.domain.Booking;
import com.EVENTORA.domain.User;
import com.EVENTORA.dto.BookingDTO;
import com.EVENTORA.repository.UserRepository;
import com.EVENTORA.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UUID eventId = UUID.fromString((String) request.get("eventId"));
        @SuppressWarnings("unchecked")
        List<String> seatIdStrings = (List<String>) request.get("seatIds");
        List<UUID> seatIds = seatIdStrings.stream().map(UUID::fromString).collect(Collectors.toList());

        try {
            Booking booking = bookingService.createBooking(user.getId(), eventId, seatIds);
            return ResponseEntity.ok(toDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BookingDTO> bookings = bookingService.getBookingsForUser(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable UUID id, Authentication authentication) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(toDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable UUID id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            Booking booking = bookingService.cancelBooking(id, user.getId());
            return ResponseEntity.ok(toDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private BookingDTO toDTO(Booking booking) {
        List<String> seatNumbers = booking.getBookingSeats() == null ? List.of() :
                booking.getBookingSeats().stream()
                        .map(bs -> bs.getSeat().getSeatNumber())
                        .collect(Collectors.toList());

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
