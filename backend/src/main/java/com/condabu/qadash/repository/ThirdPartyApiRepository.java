package com.condabu.qadash.repository;

import com.condabu.qadash.dto.ApiStatus;
import com.condabu.qadash.entity.ThirdPartyApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThirdPartyApiRepository extends JpaRepository<ThirdPartyApi, Long> {
    List<ThirdPartyApi> findByProvider(String provider);
    List<ThirdPartyApi> findByStatus(ApiStatus status);
}
