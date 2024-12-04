package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;
    private String suite;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double duration;
    private String status;
    private String message;
    private boolean critical;
    private String  runId;
    private String screenshot;
    @ElementCollection
    @CollectionTable(name = "test_tags", joinColumns = @JoinColumn(name="test_id"))
    @Column(name = "tag")
    private List<String> tags;
    @OneToMany(mappedBy = "testResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Keyword> keywords;

    
}
