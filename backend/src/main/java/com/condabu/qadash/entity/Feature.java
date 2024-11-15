package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime lastStatusUpdate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Application application;
    @ManyToMany
    @JoinTable(
            name = "feature_apis",
            joinColumns = @JoinColumn(name = "feature_id"),
            inverseJoinColumns = @JoinColumn(name = "api_id")
    )
    private Set<InternalApi> requiredApis =  new HashSet<>();
}
