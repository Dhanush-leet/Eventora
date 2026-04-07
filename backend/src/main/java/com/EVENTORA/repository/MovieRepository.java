package com.EVENTORA.repository;

import com.EVENTORA.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MovieRepository extends JpaRepository<Movie, UUID> {
    
    // Filter movies by location (city or state) via movie_shows
    @Query("SELECT DISTINCT m FROM Movie m JOIN MovieShow ms ON m.id = ms.movie.id JOIN Theatre t ON ms.theatre.id = t.id WHERE t.state = :location OR t.city = :location")
    List<Movie> findMoviesByLocation(@Param("location") String location);
}
