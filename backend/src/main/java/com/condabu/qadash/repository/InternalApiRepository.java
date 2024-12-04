package com.condabu.qadash.repository;

import com.condabu.qadash.dto.ApiStatus;
import com.condabu.qadash.entity.InternalApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternalApiRepository extends JpaRepository<InternalApi, Long> {
    List<InternalApi> findByStatus(ApiStatus status);
    @Query("SELECT DISTINCT a from  InternalApi  a LEFT  JOIN  FETCH a.statusHistory WHERE a.status = :status")
    List<InternalApi> findByStatusWithHistory(ApiStatus status);

}
