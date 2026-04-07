package com.EVENTORA.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "row_number", nullable = false)
    private String rowNumber;

    @Column(name = "column_number")
    private Integer columnNumber;

    @Column(nullable = false)
    private String tier; // STANDARD, PREMIUM, VIP, PRESTIGE

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Builder.Default
    @Column(name = "price_modifier")
    private BigDecimal priceModifier = BigDecimal.ONE;

    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, LOCKED, BOOKED, BLOCKED

    @Column(name = "locked_by")
    private UUID lockedBy;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "booked_by")
    private UUID bookedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public BigDecimal getFinalPrice() {
        return basePrice.multiply(priceModifier);
    }
}
