package com.condabu.qadash.repository;

import com.condabu.qadash.entity.DeviceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceHistoryRespository extends JpaRepository<DeviceHistory, Long> {
}
