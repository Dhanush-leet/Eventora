package com.EVENTORA.controller;

import com.EVENTORA.dto.MovieDTO;
import com.EVENTORA.dto.TheatreShowsDTO;
import com.EVENTORA.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<List<MovieDTO>> getMovies(@RequestParam(required = false) String location) {
        if (location != null && !location.trim().isEmpty()) {
            return ResponseEntity.ok(movieService.getMoviesByLocation(location));
        }
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}/theatres")
    public ResponseEntity<List<TheatreShowsDTO>> getMovieTheatres(@PathVariable UUID id) {
        return ResponseEntity.ok(movieService.getMovieTheatresAndShows(id));
    }
}
