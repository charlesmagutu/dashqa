package com.condabu.qadash.repository;

import com.condabu.qadash.entity.ApiStatusHistory;
import com.condabu.qadash.entity.InternalApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ApiStatusHistoryRepository extends JpaRepository<ApiStatusHistory, Long> {
    List<ApiStatusHistory> findByApiOrderByTimestampDesc(InternalApi api);
    List<ApiStatusHistory> findByTimestampBetween(LocalTime start, LocalTime end);
}
