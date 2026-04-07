package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SeatDTO {
    private UUID id;
    private String seatNumber;
    private String rowNumber;
    private Integer columnNumber;
    private String tier;
    private BigDecimal basePrice;
    private BigDecimal priceModifier;
    private BigDecimal finalPrice;
    private String status; // AVAILABLE, LOCKED, BOOKED, BLOCKED
    private boolean lockedByCurrentUser;
    private Long secondsUntilLockExpiry;
}
