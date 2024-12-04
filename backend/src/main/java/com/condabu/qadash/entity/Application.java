package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String version;
    private String owningTeam;
    private String technicalOwner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<Feature> features  = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "application_dependencies",
            joinColumns = @JoinColumn(name = "dependent_id"),
            inverseJoinColumns = @JoinColumn(name="dependency_id")
    )
    private Set<Application> dependencies = new HashSet<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "application_apis",
            joinColumns = @JoinColumn(name = "application_id"),
            inverseJoinColumns = @JoinColumn(name = "api_id")
    )
    private Set<ThirdPartyApi> consumedApis = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
