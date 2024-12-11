package com.condabu.qadash.service;
import com.condabu.qadash.entity.Keyword;
import com.condabu.qadash.entity.TestResult;
import com.condabu.qadash.entity.TestRun;
import com.condabu.qadash.repository.TestResultRepository;
import com.condabu.qadash.repository.TestRunRepository;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TestResultService {

    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private TestRunRepository testRunRepository;

    @Autowired
    private TestRunStatusService testRunService;

    @Autowired
    private TestRunStatusService testRunStatusService;
    public void saveResponsesFromExecutor(JsonNode jsonData){
        if (jsonData == null) {
            System.out.print("Received a null JSON from executor listener");
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
                TestRun testRun = testCaseStartDetails(jsonData);
                System.out.print("received data is"+testRun.getRunId()+ testRun.toString());
                testRunRepository.save(testRun);
               }else if (type.equalsIgnoreCase("RUN_END")){
                    TestRun testRunEnd = testRunEndDetails(jsonData);
                    testRunService.updateRunEndResults(testRunEnd);

                    System.out.println("Test testRunEnd"+testRunEnd.getRunId() + testRunEnd.getStatus());
               }else if (type.equalsIgnoreCase("SUITE_START")){
                   System.out.println("Test has been Started");
                   TestRun testRun = testRunStartDetails(jsonData);
                   System.out.print("received data is"+testRun.getRunId());
                   testRunRepository.save(testRun);
               }
               else if (type.equalsIgnoreCase("SUITE_END")){
                   TestRun testRunEnd = testRunEndDetails(jsonData);
                   try{
                       testRunService.updateRunEndResults(testRunEnd);
                   }catch (Exception e){
                       System.out.println("Error occurred"+e.getMessage());
                   }

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
        testResult.setCritical(Boolean.TRUE.equals(getBooleanNode(jsonData, "critical")));
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
        String runId = getTextNode(jsonData, "runId");

        if(!testRunService.doesRunExists(runId)) {

            TestRun testRun =  new TestRun();
            testRun.setApplication(Long.valueOf(Objects.requireNonNull(getTextNode(jsonData, "application"))));
            testRun.setRunId(getTextNode(jsonData, "runId"));
            testRun.setSuite(getTextNode(jsonData, "name"));
            testRun.setRunDate(LocalDate.now());
            testRun.setStatus(getTextNode(jsonData, "status"));
            testRun.setDuration(getTextNode(jsonData, "elapsedtime"));
            testRun.setCreatedAt(LocalDateTime.now());
            return testRun;
        }
        return null;
    }


    public static Map<String, Integer> extractStatistics(String statistics){
        Map<String, Integer> stats = new HashMap<>();
        String regex = "(\\d+) test, (\\d+) passed, (\\d+) failed";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(statistics);

        if (matcher.find()) {
            // Extract values and store them in the map
            stats.put("tests", Integer.parseInt(matcher.group(1)));
            stats.put("passed", Integer.parseInt(matcher.group(2)));
            stats.put("failed", Integer.parseInt(matcher.group(3)));
        }
        return  stats;
    }

    public TestRun testCaseStartDetails(JsonNode jsonData){
//            TestRun testRun =  new TestRun();
//            testRun.setRunId(getTextNode(jsonData, "runId"));
//            testRun.setSuite(getTextNode(jsonData, "name"));
//            testRun.setRunDate(LocalDate.now());
//            testRun.setStatus(getTextNode(jsonData, "status"));
//            testRun.setCreatedAt(LocalDateTime.now());
            return null;
    }

    public TestRun testRunEndDetails(JsonNode jsonData){
            //DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String statistics = getTextNode(jsonData,"statistics");
            Map<String, Integer> result = extractStatistics(statistics);
            TestRun testRun = new TestRun();
            testRun.setRunId(getTextNode(jsonData, "runId"));
            testRun.setEndedAt(LocalDateTime.now());
            testRun.setStatus(getTextNode(jsonData, "status"));
            testRun.setPassed(result.get("passed"));
            testRun.setFailed(result.get("failed"));
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
    private Integer getIntegerNode(JsonNode node, String fieldName) {
        return node.has(fieldName) && !node.get(fieldName).isNull() ? node.get(fieldName).asInt() : null;
    }
    public  List<TestResult> fetchAllTestResults() {
        return testResultRepository.findAll();
    }

    public List<TestResult> fetchTestResultsByRunId(String id){

        return testResultRepository.findByRunId(id);

    }
}
