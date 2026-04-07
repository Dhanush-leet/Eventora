package com.EVENTORA.service;

import com.EVENTORA.domain.*;
import com.EVENTORA.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final SeatService seatService;

    @Transactional
    public Booking createBooking(UUID userId, UUID eventId, List<UUID> seatIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Seat> seats = seatRepository.findByEventIdAndIdIn(eventId, seatIds);

        // Validate all seats are locked by this user
        for (Seat seat : seats) {
            if (!"LOCKED".equals(seat.getStatus()) || !userId.equals(seat.getLockedBy())) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is not locked by this user");
            }
        }

        BigDecimal totalPrice = seats.stream()
                .map(Seat::getFinalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String ref = generateBookingReference();

        Booking booking = Booking.builder()
                .bookingReference(ref)
                .user(user)
                .event(event)
                .totalSeats(seats.size())
                .totalPrice(totalPrice)
                .status("PENDING")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = seats.stream().map(seat ->
                BookingSeat.builder()
                        .booking(savedBooking)
                        .seat(seat)
                        .priceAtBooking(seat.getFinalPrice())
                        .build()
        ).collect(Collectors.toList());

        savedBooking.setBookingSeats(bookingSeats);

        // Update event sold seats count
        event.setSoldSeats(event.getSoldSeats() + seats.size());
        event.setLockedSeats(Math.max(0, event.getLockedSeats() - seats.size()));
        eventRepository.save(event);

        return savedBooking;
    }

    public List<Booking> getBookingsForUser(UUID userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public Booking confirmBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CONFIRMED");

        // Mark seats as booked
        List<UUID> seatIds = booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toList());
        seatService.confirmSeatsBooked(seatIds, booking.getUser().getId());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        booking.setStatus("CANCELLED");

        // Release seats
        List<UUID> seatIds = booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toList());
        seatService.unlockSeats(seatIds, userId);

        Event event = booking.getEvent();
        event.setSoldSeats(Math.max(0, event.getSoldSeats() - booking.getTotalSeats()));
        eventRepository.save(event);

        return bookingRepository.save(booking);
    }

    private String generateBookingReference() {
        return "EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
