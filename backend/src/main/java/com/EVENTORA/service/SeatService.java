package com.EVENTORA.service;

import com.EVENTORA.domain.Seat;
import com.EVENTORA.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SeatService {

    private static final int LOCK_DURATION_MINUTES = 5;
    private static final String SEAT_LOCK_PREFIX = "seat_lock:";

    private final SeatRepository seatRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public List<Seat> getSeatsForEvent(UUID eventId) {
        return seatRepository.findByEventIdOrderByRowNumberAscColumnNumberAsc(eventId);
    }

    @Transactional
    public List<Seat> lockSeats(UUID eventId, List<UUID> seatIds, UUID userId) {
        List<Seat> seats = seatRepository.findByEventIdAndIdIn(eventId, seatIds);

        for (Seat seat : seats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is not available");
            }
        }

        LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES);
        for (Seat seat : seats) {
            seat.setStatus("LOCKED");
            seat.setLockedBy(userId);
            seat.setLockedUntil(lockUntil);
            // Also cache in Redis for fast access
            String redisKey = SEAT_LOCK_PREFIX + seat.getId();
            redisTemplate.opsForValue().set(redisKey, userId.toString(), LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        }

        return seatRepository.saveAll(seats);
    }

    @Transactional
    public void unlockSeats(List<UUID> seatIds, UUID userId) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        for (Seat seat : seats) {
            if ("LOCKED".equals(seat.getStatus()) && userId.equals(seat.getLockedBy())) {
                seat.setStatus("AVAILABLE");
                seat.setLockedBy(null);
                seat.setLockedUntil(null);
                redisTemplate.delete(SEAT_LOCK_PREFIX + seat.getId());
            }
        }
        seatRepository.saveAll(seats);
    }

    @Transactional
    public void confirmSeatsBooked(List<UUID> seatIds, UUID userId) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        for (Seat seat : seats) {
            seat.setStatus("BOOKED");
            seat.setBookedBy(userId);
            seat.setLockedBy(null);
            seat.setLockedUntil(null);
            redisTemplate.delete(SEAT_LOCK_PREFIX + seat.getId());
        }
        seatRepository.saveAll(seats);
    }

    @Transactional
    @Scheduled(fixedDelay = 60000) // every minute
    public void releaseExpiredLocks() {
        int released = seatRepository.releaseExpiredLocks(LocalDateTime.now());
        if (released > 0) {
            log.info("Released {} expired seat locks", released);
        }
    }
}
