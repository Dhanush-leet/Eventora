package com.EVENTORA.repository;

import com.EVENTORA.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByEventIdAndStatus(UUID eventId, String status);
}
