package com.condabu.qadash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.condabu.qadash.entity.TestRunConfig;
import com.condabu.qadash.service.TestRunService;

@RestController
@CrossOrigin(origins = "http://localhost:5173") 
@RequestMapping("/api/v1/start-test")
public class TestRunController {

    @Autowired
    private final TestRunService testRunService;

    public TestRunController(TestRunService testRunService) {
        this.testRunService = testRunService;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startTestRun(@RequestBody TestRunConfig testRunConfig) {
        try {

            testRunService.startTestRun(testRunConfig);
            return ResponseEntity.ok("Run started successifully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error running the test: " + e.getMessage());
        }
    }
}
