package com.condabu.qadash.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FetchTestResultsResponse {
    private Long id;
    private String critical;
    private Double duration;
    private LocalDateTime endTime;
    private String message;
    private String name;
    private LocalDateTime startTime;
    private String status;
    private String suite;
    private String type;
}
