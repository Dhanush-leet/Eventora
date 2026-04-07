package com.EVENTORA.repository;

import com.EVENTORA.domain.MovieShow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MovieShowRepository extends JpaRepository<MovieShow, UUID> {
    List<MovieShow> findByMovieId(UUID movieId);
}
