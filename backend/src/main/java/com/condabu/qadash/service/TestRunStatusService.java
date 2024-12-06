package com.condabu.qadash.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.condabu.qadash.entity.TestRun;
import com.condabu.qadash.repository.TestRunRepository;

@Service
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

    public void updateRunEndResults(TestRun testRunEnd){
        if(doesRunExists(testRunEnd.getRunId())){
            TestRun existingRun = testRunRepository.findByRunId(testRunEnd.getRunId()).get(0);
            existingRun.setEndedAt(testRunEnd.getEndedAt());
            existingRun.setDuration(testRunEnd.getDuration());
            existingRun.setStatus(testRunEnd.getStatus());
            testRunRepository.save(existingRun);
        }
    }

    public List<TestRun> getAllTestRunsByAppId(Long appId) {
        return testRunRepository.findByApplication(appId);
    }
}
