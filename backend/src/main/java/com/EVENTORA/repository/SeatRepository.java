package com.EVENTORA.repository;

import com.EVENTORA.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {

    List<Seat> findByEventIdOrderByRowNumberAscColumnNumberAsc(UUID eventId);

    List<Seat> findByEventIdAndStatus(UUID eventId, String status);

    @Query("SELECT s FROM Seat s WHERE s.event.id = :eventId AND s.id IN :seatIds")
    List<Seat> findByEventIdAndIdIn(@Param("eventId") UUID eventId, @Param("seatIds") List<UUID> seatIds);

    @Modifying
    @Query("UPDATE Seat s SET s.status = 'AVAILABLE', s.lockedBy = null, s.lockedUntil = null " +
           "WHERE s.status = 'LOCKED' AND s.lockedUntil < :now")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);

    Optional<Seat> findByEventIdAndSeatNumber(UUID eventId, String seatNumber);

    long countByEventIdAndStatus(UUID eventId, String status);
}
