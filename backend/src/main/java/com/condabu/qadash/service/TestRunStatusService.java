package com.condabu.qadash.service;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.condabu.qadash.entity.TestRun;
import com.condabu.qadash.repository.TestRunRepository;

@Service
@Slf4j
public class TestRunStatusService {
    @Autowired
    private TestRunRepository testRunRepository;

    public List<TestRun> getAllTestRuns(){
        return testRunRepository.findAll();
    }

    public List<TestRun> getTestRunById(String runId){
        return testRunRepository.findByRunId(runId);
    }


    public boolean doesRunExists(String runId){
        List<TestRun> existingRuns = testRunRepository.findByRunId(runId);
        return !existingRuns.isEmpty();
    }

    public void updateTestRunExecutionEndResults(TestRun testRunEnd) {
        // Check if the run exists by its RunId
        List<TestRun> existingRuns = testRunRepository.findByRunId(testRunEnd.getRunId());

        if (!existingRuns.isEmpty()) {
            TestRun existingRun = existingRuns.get(0); // Get the first match

            // Update fields
            existingRun.setEndedAt(testRunEnd.getEndedAt());
            existingRun.setDuration(testRunEnd.getDuration());
            existingRun.setTotal(testRunEnd.getTotal());
            existingRun.setPassed(testRunEnd.getPassed());
            existingRun.setFailed(testRunEnd.getFailed());
            existingRun.setStatus(testRunEnd.getStatus());

            // Save the updated TestRun entity
            TestRun updatedRun = testRunRepository.save(existingRun);

            if (updatedRun != null) {
                log.info("Test run with id {} updated successfully. Ended at: {}, Duration: {}, Status: {}",
                        testRunEnd.getRunId(), testRunEnd.getEndedAt(), testRunEnd.getDuration(), testRunEnd.getStatus());
            } else {
                log.error("Failed to update test run with id {}", testRunEnd.getRunId());
            }
        } else {
            log.warn("Test run with id {} does not exist. No update performed.", testRunEnd.getRunId());
        }
    }


    public List<TestRun> getAllTestRunsByAppId(Long appId) {
        return testRunRepository.findByApplication(appId);
    }
}
