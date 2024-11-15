package com.condabu.qadash.repository;

import com.condabu.qadash.entity.Feature;
import com.condabu.qadash.entity.InternalApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
    List<Feature> findAllByApplicationId(Long applicationId);

    @Query("SELECT f from Feature  f WHERE  EXISTS (SELECT 1 FROM f.requiredApis a WHERE  a.status = 'DOWN')")
    List<Feature> findAffectedFeatures();

}