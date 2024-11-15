package com.condabu.qadash.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TestRun {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long Id;
    private String runId;
    private LocalDate runDate ;
    private String status;
    private String duration;
    private String suite;
    private String triggeredBy;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
}
