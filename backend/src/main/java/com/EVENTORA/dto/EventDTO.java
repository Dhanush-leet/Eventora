package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EventDTO {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private String city;
    private String venue;
    private String venueAddress;
    private LocalDateTime eventDate;
    private Integer durationMinutes;
    private BigDecimal basePrice;
    private Integer totalSeats;
    private Integer soldSeats;
    private Integer availableSeats;
    private BigDecimal demandScore;
    private BigDecimal popularityPercentile;
    private String bannerImageUrl;
    private String status;
    private String artistName;
    private String language;
    private String genre;
    private BigDecimal currentPrice; // dynamic price
    private Integer fillPercentage; // how full the event is
    private LocalDateTime createdAt;
}
