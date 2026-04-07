package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TheatreShowsDTO {
    private UUID theatreId;
    private String theatreName;
    private String city;
    private String state;
    private String address;
    private List<ShowTimeDTO> shows;
}
