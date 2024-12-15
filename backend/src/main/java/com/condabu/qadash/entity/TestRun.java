package com.condabu.qadash.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
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
   // @Column(nullable = false,columnDefinition = "varchar(100) default 'RUNNING'")
    private String status ="RUNNING";
    private String duration;
    private String suite;
   // @Column(nullable = false,columnDefinition = "varchar(200) default 'CICD'")
    private String triggeredBy = "CICD";
    private Long application;
    private Integer total;
    private Integer passed;
    private Integer failed;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
}
