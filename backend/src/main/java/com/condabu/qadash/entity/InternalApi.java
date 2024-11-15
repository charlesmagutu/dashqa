package com.condabu.qadash.entity;

import com.condabu.qadash.dto.ApiStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class InternalApi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String endpoint;
    private String description;
    private String version;
    private String healthCheckEndpoint;

    @Enumerated(EnumType.STRING)
    private ApiStatus status= ApiStatus.UP;
    private LocalDateTime lastStatusChange;
    private LocalDateTime lastHealthCheck;
    @OneToMany(mappedBy = "api", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApiStatusHistory> statusHistory = new ArrayList<>();

}
