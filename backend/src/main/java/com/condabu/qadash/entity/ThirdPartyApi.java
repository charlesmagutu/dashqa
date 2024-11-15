package com.condabu.qadash.entity;

import com.condabu.qadash.dto.ApiStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Data
public class ThirdPartyApi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String provider;
    private String endpoint;
    private String apiKey;
    private String healthCheckEndpoint;
    @Enumerated(EnumType.STRING)
    private ApiStatus status = ApiStatus.UP;
    private LocalDateTime lastStatusChange;
    private LocalDateTime lastHealthCheck;
}
