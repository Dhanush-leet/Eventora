package com.EVENTORA.service;

import com.EVENTORA.domain.Movie;
import com.EVENTORA.domain.MovieShow;
import com.EVENTORA.domain.Theatre;
import com.EVENTORA.dto.MovieDTO;
import com.EVENTORA.dto.ShowTimeDTO;
import com.EVENTORA.dto.TheatreShowsDTO;
import com.EVENTORA.repository.MovieRepository;
import com.EVENTORA.repository.MovieShowRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieShowRepository movieShowRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public MovieService(MovieRepository movieRepository, 
                        MovieShowRepository movieShowRepository, 
                        RedisTemplate<String, String> redisTemplate,
                        ObjectMapper objectMapper) {
        this.movieRepository = movieRepository;
        this.movieShowRepository = movieShowRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public List<MovieDTO> getAllMovies() {
        String cacheKey = "movies:all";
        String cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<MovieDTO>>() {});
            } catch (JsonProcessingException e) {
                // fallback
            }
        }

        List<MovieDTO> movies = movieRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(movies), 10, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            // ignore
        }

        return movies;
    }

    public List<MovieDTO> getMoviesByLocation(String location) {
        String cacheKey = "movies:location:" + location.toLowerCase();
        String cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<MovieDTO>>() {});
            } catch (JsonProcessingException e) {
                // fallback
            }
        }

        List<MovieDTO> movies = movieRepository.findMoviesByLocation(location).stream().map(this::mapToDTO).collect(Collectors.toList());

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(movies), 10, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            // ignore
        }

        return movies;
    }

    public List<TheatreShowsDTO> getMovieTheatresAndShows(UUID movieId) {
        List<MovieShow> shows = movieShowRepository.findByMovieId(movieId);

        // Group by Theatre
        Map<Theatre, List<MovieShow>> grouped = shows.stream()
                .collect(Collectors.groupingBy(MovieShow::getTheatre));

        List<TheatreShowsDTO> result = new ArrayList<>();
        for (Map.Entry<Theatre, List<MovieShow>> entry : grouped.entrySet()) {
            Theatre theatre = entry.getKey();
            List<ShowTimeDTO> showDTOs = entry.getValue().stream()
                    .map(s -> ShowTimeDTO.builder()
                            .showId(s.getId())
                            .showTime(s.getShowTime())
                            .build())
                    .collect(Collectors.toList());

            result.add(TheatreShowsDTO.builder()
                    .theatreId(theatre.getId())
                    .theatreName(theatre.getName())
                    .city(theatre.getCity())
                    .state(theatre.getState())
                    .address(theatre.getAddress())
                    .shows(showDTOs)
                    .build());
        }

        return result;
    }

    private MovieDTO mapToDTO(Movie m) {
        return MovieDTO.builder()
                .id(m.getId())
                .title(m.getTitle())
                .genre(m.getGenre())
                .language(m.getLanguage())
                .duration(m.getDuration())
                .rating(m.getRating())
                .posterUrl(m.getPosterUrl())
                .build();
    }
}
