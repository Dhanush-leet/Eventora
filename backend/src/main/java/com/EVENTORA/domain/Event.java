package com.EVENTORA.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String venue;

    @Column(name = "venue_address", columnDefinition = "TEXT")
    private String venueAddress;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Builder.Default
    @Column(name = "sold_seats")
    private Integer soldSeats = 0;

    @Builder.Default
    @Column(name = "locked_seats")
    private Integer lockedSeats = 0;

    @Builder.Default
    @Column(name = "demand_score")
    private BigDecimal demandScore = BigDecimal.ONE;

    @Column(name = "popularity_percentile")
    private BigDecimal popularityPercentile;

    @Column(name = "banner_image_url")
    private String bannerImageUrl;

    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    // Source tracking for BMS events
    @Column(name = "external_source")
    private String externalSource;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "artist_name")
    private String artistName;

    @Column(name = "language")
    private String language;

    @Column(name = "genre")
    private String genre;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
