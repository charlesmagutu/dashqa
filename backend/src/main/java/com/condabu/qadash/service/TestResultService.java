package com.condabu.qadash.service;
import com.condabu.qadash.entity.Keyword;
import com.condabu.qadash.entity.TestResult;
import com.condabu.qadash.entity.TestRun;
import com.condabu.qadash.repository.TestResultRepository;
import com.condabu.qadash.repository.TestRunRepository;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TestResultService {

    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private TestRunRepository testRunRepository;

    @Autowired
    private TestRunStatusService testRunService;


    public void saveResponsesFromExecutor(JsonNode jsonData){
        if (jsonData == null) {
            System.out.print("Received a null JSON from executor listerner");
        }
        try{
            @SuppressWarnings("null")
            String type = jsonData.get("type") !=null ? jsonData.get("type").asText() : "";
            if (!type.isEmpty()) {
               if(type.equalsIgnoreCase("TEST_END")){
                TestResult testResult = convertResponseToTestResultEntity(jsonData);
                testResultRepository.save(testResult);
               }else if (type.equalsIgnoreCase("TEST_START")){
                System.out.println("Test has been Started");
                TestRun testRun = testRunStartDetails(jsonData);
                System.out.print("received data is"+testRun.getRunId());
                testRunRepository.save(testRun);
               }else if (type.equalsIgnoreCase("RUN_END")){
                    TestRun testRunEnd = testRunEndDetails(jsonData);
                    testRunService.updateRunEndResults(testRunEnd);

                    System.out.println("Test testRunEnd"+testRunEnd.getRunId() + testRunEnd.getStatus());
               }
               else{
                System.out.println("To be implemented" + type);
               }
            }
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
    }

    public TestResult convertResponseToTestResultEntity(JsonNode jsonData) {
        TestResult testResult = new TestResult();
        testResult.setSuite(getTextNode(jsonData, "suite"));
        testResult.setName(getTextNode(jsonData, "name"));
        testResult.setStartTime(getLocalDateTime(jsonData, "startTime"));
        testResult.setEndTime(getLocalDateTime(jsonData, "endTime"));
        testResult.setDuration(getDoubleNode(jsonData, "duration"));
        testResult.setStatus(getTextNode(jsonData, "status"));
        testResult.setMessage(getTextNode(jsonData, "message"));
        testResult.setCritical(getBooleanNode(jsonData, "critical"));
        testResult.setScreenshot(getTextNode(jsonData, "screenshot"));
        testResult.setRunId(getTextNode(jsonData, "runId"));
        List<String> tags = new ArrayList<>();
        if (jsonData.has("tags")) {
            jsonData.get("tags").forEach(tag -> tags.add(tag.asText()));
        }
        testResult.setTags(tags);
        // Extracting keywords that start with "keywords"
        List<Keyword> keywords = new ArrayList<>();
        if (jsonData.has("metrics") && jsonData.get("metrics").has("keywords")) {
            jsonData.get("metrics").get("keywords").forEach(keywordNode -> {
                String keywordName = keywordNode.get("name").asText();
                if (keywordName.startsWith("keywords")) {
                    keywords.add(new Keyword(keywordName));  // Ensure the Keyword constructor matches your entity
                }
            });
        }
        testResult.setKeywords(keywords); // Now this is a List<Keyword>

        return testResult;
    }


    public TestRun testRunStartDetails(JsonNode jsonData){
            TestRun testRun = new TestRun();
            testRun.setRunId(getTextNode(jsonData, "runId"));
            testRun.setRunDate(LocalDate.now());
            testRun.setStatus(getTextNode(jsonData, "status"));
            testRun.setCreatedAt(LocalDateTime.now());
            return testRun;
    }

    public TestRun testRunEndDetails(JsonNode jsonData){
            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            TestRun testRun = new TestRun();
            testRun.setRunId(getTextNode(jsonData, "runId"));
            testRun.setEndedAt(LocalDateTime.now());
            testRun.setStatus(getTextNode(jsonData, "status"));
            return testRun;
    }
    private String getTextNode(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asText() : null;
    }

    private LocalDateTime getLocalDateTime(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? LocalDateTime.parse(node.get(fieldName).asText()) : null;
    }

    private Double getDoubleNode(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asDouble() : null;
    }

    private Boolean getBooleanNode(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asBoolean() : null;
    }

    public  List<TestResult> fetchAllTestResults() {
        return testResultRepository.findAll();
    }

    public List<TestResult> fetchTestResultsByRunId(String id){

        return testResultRepository.findByRunId(id);

    }
}
