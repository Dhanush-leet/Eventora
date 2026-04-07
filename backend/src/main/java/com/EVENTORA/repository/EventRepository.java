package com.EVENTORA.repository;

import com.EVENTORA.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    Page<Event> findByStatusOrderByEventDateAsc(String status, Pageable pageable);

    Page<Event> findByCityIgnoreCaseAndStatusOrderByEventDateAsc(String city, String status, Pageable pageable);

    Page<Event> findByCategoryIgnoreCaseAndStatusOrderByEventDateAsc(String category, String status, Pageable pageable);

    Page<Event> findByCityIgnoreCaseAndCategoryIgnoreCaseAndStatusOrderByEventDateAsc(
            String city, String category, String status, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.artistName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Event> searchEvents(@Param("query") String query, Pageable pageable);

    List<Event> findByExternalSourceAndExternalId(String externalSource, String externalId);

    @Query("SELECT DISTINCT e.city FROM Event e WHERE e.status = 'ACTIVE' ORDER BY e.city")
    List<String> findDistinctCities();

    @Query("SELECT DISTINCT e.category FROM Event e WHERE e.status = 'ACTIVE' ORDER BY e.category")
    List<String> findDistinctCategories();

    List<Event> findTop6ByStatusOrderByPopularityPercentileDesc(String status);
}
