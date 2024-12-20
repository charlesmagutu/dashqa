package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TestDevices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private String serialNumber;
    private String manufacturer;
    private String image;
    private String os;
    private String status;
    @Embedded
    private Specifications specifications;
    @ManyToOne
    private User assignedTo;
    private LocalDateTime last_checkout;

}
