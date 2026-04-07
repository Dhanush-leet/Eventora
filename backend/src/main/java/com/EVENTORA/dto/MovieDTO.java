package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class MovieDTO {
    private UUID id;
    private String title;
    private String genre;
    private String language;
    private Integer duration;
    private Double rating;
    private String posterUrl;
}
