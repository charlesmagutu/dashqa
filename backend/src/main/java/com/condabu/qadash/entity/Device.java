package com.condabu.qadash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Device {
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
    private Specifications  specifications;
    @ManyToOne
    private User assignedTo;

    @OneToMany
    private List<User> availableUsers;
    @OneToMany(cascade = CascadeType.ALL)
    private List<DeviceHistory> deviceHistory;
    private LocalDateTime last_checkout;


}

@Setter
@Getter
@Embeddable
class Specifications {
    private String processor;
    private String ram;
    private String storage;
}
