package com.condabu.qadash.repository;


import com.condabu.qadash.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
//    List<Device> findByAssignedTo(Long assignedTo);
}
