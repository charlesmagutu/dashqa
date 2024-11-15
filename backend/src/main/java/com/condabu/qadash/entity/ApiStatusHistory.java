package com.condabu.qadash.entity;

import com.condabu.qadash.dto.ApiStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ApiStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ApiStatus status;
    private LocalDateTime timestamp;
    private String reason;

    @ManyToOne
    private InternalApi api;

}
