package com.condabu.qadash.repository;

import com.condabu.qadash.entity.TestResult;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByRunId(String id);
}
