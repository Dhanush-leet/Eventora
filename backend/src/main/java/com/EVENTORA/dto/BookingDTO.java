package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BookingDTO {
    private UUID id;
    private String bookingReference;
    private String eventTitle;
    private String eventCity;
    private String eventVenue;
    private LocalDateTime eventDate;
    private String bannerImageUrl;
    private Integer totalSeats;
    private BigDecimal totalPrice;
    private String status;
    private List<String> seatNumbers;
    private String qrHash;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
