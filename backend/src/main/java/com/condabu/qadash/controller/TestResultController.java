package com.condabu.qadash.controller;

import com.condabu.qadash.entity.TestResult;
import com.condabu.qadash.entity.TestRun;
import com.condabu.qadash.service.TestResultService;
import com.condabu.qadash.service.TestRunStatusService;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/test")
@CrossOrigin(origins = "http://localhost:5173") 
public class TestResultController {
    @Autowired
    private TestResultService testResultService;

    @Autowired
    private TestRunStatusService testRunService;
    @PostMapping
    public ResponseEntity<String> receiveExecutionData(@RequestBody JsonNode jsonData){
        testResultService.saveResponsesFromExecutor(jsonData);
        return ResponseEntity.ok("Test result processed");
    }

    @GetMapping
    public List<TestResult> getExecutionResults(){
        return  testResultService.fetchAllTestResults();
    }

    @GetMapping("/{runId}")
    public List<TestResult> getResultsById(@PathVariable String runId){
        return testResultService.fetchTestResultsByRunId(runId);
    }

    @GetMapping("/run")
    public List<TestRun> getAllRuns(){
        return testRunService.getAllTestRuns();
    }

    @GetMapping("/run/app/{appId}")
    public  List<TestRun> getAllApplicationRuns(@PathVariable Long appId){
        return  testRunService.getAllTestRunsByAppId(appId);
    }
}
