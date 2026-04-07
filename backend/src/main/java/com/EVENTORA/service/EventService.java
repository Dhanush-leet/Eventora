package com.EVENTORA.service;

import com.EVENTORA.domain.Event;
import com.EVENTORA.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Page<Event> getEvents(String city, String category, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending());

        if (search != null && !search.isBlank()) {
            return eventRepository.searchEvents(search.trim(), pageable);
        }

        boolean hasCity = city != null && !city.isBlank() && !city.equalsIgnoreCase("all");
        boolean hasCat  = category != null && !category.isBlank() && !category.equalsIgnoreCase("all");

        if (hasCity && hasCat) {
            return eventRepository.findByCityIgnoreCaseAndCategoryIgnoreCaseAndStatusOrderByEventDateAsc(
                    city, category, "ACTIVE", pageable);
        } else if (hasCity) {
            return eventRepository.findByCityIgnoreCaseAndStatusOrderByEventDateAsc(city, "ACTIVE", pageable);
        } else if (hasCat) {
            return eventRepository.findByCategoryIgnoreCaseAndStatusOrderByEventDateAsc(category, "ACTIVE", pageable);
        }

        return eventRepository.findByStatusOrderByEventDateAsc("ACTIVE", pageable);
    }

    public Optional<Event> getEventById(UUID id) {
        return eventRepository.findById(id);
    }

    public List<Event> getFeaturedEvents() {
        return eventRepository.findTop6ByStatusOrderByPopularityPercentileDesc("ACTIVE");
    }

    public List<String> getAvailableCities() {
        return eventRepository.findDistinctCities();
    }

    public List<String> getAvailableCategories() {
        return eventRepository.findDistinctCategories();
    }

    @Transactional
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(UUID id) {
        eventRepository.findById(id).ifPresent(event -> {
            event.setStatus("CANCELLED");
            eventRepository.save(event);
        });
    }
}
