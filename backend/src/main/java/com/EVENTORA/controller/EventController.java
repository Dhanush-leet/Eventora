package com.EVENTORA.controller;

import com.EVENTORA.domain.Event;
import com.EVENTORA.dto.EventDTO;
import com.EVENTORA.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<?> getEvents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Page<Event> events = eventService.getEvents(city, category, search, page, size);
        Page<EventDTO> dtoPage = events.map(this::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable UUID id) {
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(toDTO(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedEvents() {
        List<EventDTO> featured = eventService.getFeaturedEvents()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/filters")
    public ResponseEntity<?> getFilters() {
        return ResponseEntity.ok(Map.of(
                "cities", eventService.getAvailableCities(),
                "categories", eventService.getAvailableCategories()
        ));
    }

    private EventDTO toDTO(Event event) {
        int available = event.getTotalSeats() - event.getSoldSeats() - event.getLockedSeats();
        int fill = (int) ((double)(event.getSoldSeats() + event.getLockedSeats()) / event.getTotalSeats() * 100);

        // Dynamic pricing: base price * demand multiplier
        BigDecimal demandMultiplier = BigDecimal.ONE;
        if (event.getDemandScore() != null) {
            // Scale: demand 1.0 = 1x, demand 5.0 = 2x
            demandMultiplier = BigDecimal.ONE.add(
                event.getDemandScore().subtract(BigDecimal.ONE)
                    .multiply(new BigDecimal("0.25"))
            );
        }
        BigDecimal currentPrice = event.getBasePrice().multiply(demandMultiplier)
                .setScale(0, java.math.RoundingMode.HALF_UP);

        return EventDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .city(event.getCity())
                .venue(event.getVenue())
                .venueAddress(event.getVenueAddress())
                .eventDate(event.getEventDate())
                .durationMinutes(event.getDurationMinutes())
                .basePrice(event.getBasePrice())
                .totalSeats(event.getTotalSeats())
                .soldSeats(event.getSoldSeats())
                .availableSeats(Math.max(0, available))
                .demandScore(event.getDemandScore())
                .popularityPercentile(event.getPopularityPercentile())
                .bannerImageUrl(event.getBannerImageUrl())
                .status(event.getStatus())
                .artistName(event.getArtistName())
                .language(event.getLanguage())
                .genre(event.getGenre())
                .currentPrice(currentPrice)
                .fillPercentage(Math.min(100, fill))
                .createdAt(event.getCreatedAt())
                .build();
    }
}
