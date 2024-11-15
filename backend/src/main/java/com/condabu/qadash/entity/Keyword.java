package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Keyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private LocalDateTime startTime;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestResult testResult;

    public Keyword(String keywordName) {
    }
}
