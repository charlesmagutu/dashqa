package com.condabu.qadash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.condabu.qadash.entity.TestRun;

public interface TestRunRepository extends JpaRepository<TestRun, Long>{

    List<TestRun> findByRunId(String runId);
}
