package com.condabu.qadash.repository;

import com.condabu.qadash.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByNameContainingIgnoreCase(String name);
    @Query("SELECT a FROM Application a LEFT JOIN FETCH a.features LEFT JOIN FETCH a.dependencies WHERE a.id = :id" )
    Optional<Application> findByIdWithDependencies(Long id);

    @Query("SELECT DISTINCT a FROM  Application  a LEFT JOIN FETCH  a.dependencies WHERE :targetApp MEMBER  of a.dependencies")
    List<Application> findDependentApplications(Application targetApp);
}
