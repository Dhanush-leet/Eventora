package com.EVENTORA.controller;

import com.EVENTORA.domain.Seat;
import com.EVENTORA.domain.User;
import com.EVENTORA.dto.SeatDTO;
import com.EVENTORA.repository.UserRepository;
import com.EVENTORA.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;
    private final UserRepository userRepository;

    @GetMapping("/{eventId}/seats")
    public ResponseEntity<?> getSeats(@PathVariable UUID eventId) {
        List<Seat> seats = seatService.getSeatsForEvent(eventId);
        List<SeatDTO> dtos = seats.stream().map(s -> toDTO(s, null)).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{eventId}/seats/lock")
    public ResponseEntity<?> lockSeats(
            @PathVariable UUID eventId,
            @RequestBody Map<String, List<String>> request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UUID> seatIds = request.get("seatIds").stream()
                .map(UUID::fromString).collect(Collectors.toList());

        try {
            List<Seat> locked = seatService.lockSeats(eventId, seatIds, user.getId());
            List<SeatDTO> dtos = locked.stream().map(s -> toDTO(s, user.getId())).collect(Collectors.toList());
            return ResponseEntity.ok(Map.of("seats", dtos, "lockExpiresAt",
                    LocalDateTime.now().plusMinutes(5).toString()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{eventId}/seats/unlock")
    public ResponseEntity<?> unlockSeats(
            @PathVariable UUID eventId,
            @RequestBody Map<String, List<String>> request,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UUID> seatIds = request.get("seatIds").stream()
                .map(UUID::fromString).collect(Collectors.toList());

        seatService.unlockSeats(seatIds, user.getId());
        return ResponseEntity.ok(Map.of("message", "Seats unlocked successfully"));
    }

    private SeatDTO toDTO(Seat seat, UUID currentUserId) {
        Long secondsLeft = null;
        if ("LOCKED".equals(seat.getStatus()) && seat.getLockedUntil() != null) {
            secondsLeft = ChronoUnit.SECONDS.between(LocalDateTime.now(), seat.getLockedUntil());
            if (secondsLeft < 0) secondsLeft = 0L;
        }

        return SeatDTO.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .rowNumber(seat.getRowNumber())
                .columnNumber(seat.getColumnNumber())
                .tier(seat.getTier())
                .basePrice(seat.getBasePrice())
                .priceModifier(seat.getPriceModifier())
                .finalPrice(seat.getFinalPrice())
                .status(seat.getStatus())
                .lockedByCurrentUser(currentUserId != null && currentUserId.equals(seat.getLockedBy()))
                .secondsUntilLockExpiry(secondsLeft)
                .build();
    }
}
