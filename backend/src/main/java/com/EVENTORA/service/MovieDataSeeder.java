package com.EVENTORA.service;

import com.EVENTORA.domain.Movie;
import com.EVENTORA.domain.MovieShow;
import com.EVENTORA.domain.Theatre;
import com.EVENTORA.repository.MovieRepository;
import com.EVENTORA.repository.MovieShowRepository;
import com.EVENTORA.repository.TheatreRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class MovieDataSeeder implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final MovieShowRepository movieShowRepository;

    public MovieDataSeeder(MovieRepository movieRepository, TheatreRepository theatreRepository, MovieShowRepository movieShowRepository) {
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.movieShowRepository = movieShowRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (movieRepository.count() > 0) {
            System.out.println("Movies already seeded. Skipping.");
            return;
        }

        // Seed Movies
        Movie m1 = Movie.builder().title("Fighter").genre("Action/Thriller").language("Hindi").duration(166).rating(8.5).posterUrl("https://picsum.photos/seed/fighter/800/1200").build();
        Movie m2 = Movie.builder().title("Kalki 2898 AD").genre("Sci-Fi/Action").language("Telugu").duration(180).rating(9.2).posterUrl("https://picsum.photos/seed/kalki/800/1200").build();
        Movie m3 = Movie.builder().title("Dune: Part Two").genre("Sci-Fi/Adventure").language("English").duration(166).rating(9.0).posterUrl("https://picsum.photos/seed/dune/800/1200").build();
        Movie m4 = Movie.builder().title("Leo").genre("Action/Crime").language("Tamil").duration(164).rating(8.8).posterUrl("https://picsum.photos/seed/leo/800/1200").build();
        Movie m5 = Movie.builder().title("Oppenheimer").genre("Biography/Drama").language("English").duration(180).rating(9.1).posterUrl("https://picsum.photos/seed/oppen/800/1200").build();
        movieRepository.saveAll(Arrays.asList(m1, m2, m3, m4, m5));

        // Seed Theatres
        Theatre t1 = Theatre.builder().name("PVR ICON").city("Mumbai").state("Maharashtra").address("Andheri West").build();
        Theatre t2 = Theatre.builder().name("Cinepolis").city("Pune").state("Maharashtra").address("Seasons Mall").build();
        Theatre t3 = Theatre.builder().name("Sathyam Cinemas").city("Chennai").state("Tamil Nadu").address("Royapettah").build();
        Theatre t4 = Theatre.builder().name("INOX").city("Bangalore").state("Karnataka").address("Mantri Square").build();
        Theatre t5 = Theatre.builder().name("AMB Cinemas").city("Hyderabad").state("Telangana").address("Gachibowli").build();
        theatreRepository.saveAll(Arrays.asList(t1, t2, t3, t4, t5));

        // Seed Shows for next few days
        List<Movie> movies = Arrays.asList(m1, m2, m3, m4, m5);
        List<Theatre> theatres = Arrays.asList(t1, t2, t3, t4, t5);
        
        LocalDate today = LocalDate.now();
        LocalTime[] times = {LocalTime.of(10, 0), LocalTime.of(14, 0), LocalTime.of(18, 30), LocalTime.of(22, 0)};

        for (Movie movie : movies) {
            for (Theatre theatre : theatres) {
                for (int day = 0; day < 3; day++) {
                    for (LocalTime time : times) {
                        MovieShow show = MovieShow.builder()
                                .movie(movie)
                                .theatre(theatre)
                                .showTime(LocalDateTime.of(today.plusDays(day), time))
                                .build();
                        movieShowRepository.save(show);
                    }
                }
            }
        }
        System.out.println("Movies and Theatres seeded successfully.");
    }
}
