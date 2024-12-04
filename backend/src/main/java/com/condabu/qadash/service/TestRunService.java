package com.condabu.qadash.service;

import com.condabu.qadash.entity.TestRunConfig;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TestRunService {

    private static final Logger logger = Logger.getLogger(TestRunService.class.getName());

    // Paths
    private static final String VENV_PYTHON_PATH = "/home/condabu/development/dashqa/testrunner/venv/bin/python3";
    private static final String TEST_RUNNER_SCRIPT = "/home/condabu/development/dashqa/testrunner/TestRunner.py";
    private static final String REQUIREMENTS_FILE = "/home/condabu/development/dashqa/testrunner/requirements.txt";

    @Async
    public CompletableFuture<String> startTestRun(TestRunConfig testRunConfig) {
        try {
            installMissingModules(); // Ensure all modules are installed before running
            List<String> command = buildTestCommand(testRunConfig);
            String result = executeCommand(command, false);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error running test: ", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    private List<String> buildTestCommand(TestRunConfig testRunConfig) {
        List<String> command = new ArrayList<>();

        // Add required arguments with correct formatting
        if (testRunConfig.getRunId() != null) {
            command.add("--runId");
            command.add(testRunConfig.getRunId());
        }

        if (testRunConfig.getEnvironment() != null) {
            command.add("--environment");
            command.add(testRunConfig.getEnvironment());
        }

        if (testRunConfig.getBrowser() != null) {
            command.add("--browser");
            command.add(testRunConfig.getBrowser());
        }

        // Optional flags
        if (testRunConfig.isDryRun()) {
            command.add("--dry-run");
        }
        if (testRunConfig.isLog()) {
            command.add("--log");
        }
        if (testRunConfig.isOutput()) {
            command.add("--output");
        }
        if (testRunConfig.isCaptureScreenshot()) {
            command.add("--capture-screenshot");
        }
        if (testRunConfig.isVideoRecording()) {
            command.add("--video-recording");
        }
        if (testRunConfig.isHeadless()) {
            command.add("--headless");
        }

        // Include/Exclude Tags
        if (testRunConfig.getIncludeTags() != null && !testRunConfig.getIncludeTags().isEmpty()) {
            command.add("--include");
            command.addAll(testRunConfig.getIncludeTags());
        }
        if (testRunConfig.getExcludeTags() != null && !testRunConfig.getExcludeTags().isEmpty()) {
            command.add("--exclude");
            command.addAll(testRunConfig.getExcludeTags());
        }

        // Script folder path
        String scriptPath = testRunConfig.getScriptPath();
        if (scriptPath == null) {
            scriptPath = "/home/condabu/development/dashqa/testrunner/suites/Omni";
        }
        command.add("--scriptsFolder");
        command.add(scriptPath);

        logger.info("Command to run: " + String.join(" ", command));
        return command;
    }

    private void installMissingModules() throws IOException {
        String installCommand = String.format(
            "source /home/condabu/development/dashqa/testrunner/venv/bin/activate && pip install -r %s",
            REQUIREMENTS_FILE
        );

        List<String> command = new ArrayList<>();
        command.add("bash");
        command.add("-c");
        command.add(installCommand);
        
        executeCommand(command, true);
    }

    private String executeCommand(List<String> command, boolean isShellCommand) throws IOException {
        ProcessBuilder processBuilder;
        if (isShellCommand) {
            processBuilder = new ProcessBuilder(command);
        } else {
            List<String> fullCommand = new ArrayList<>();
            fullCommand.add(VENV_PYTHON_PATH);
            fullCommand.add(TEST_RUNNER_SCRIPT);
            fullCommand.addAll(command);
            processBuilder = new ProcessBuilder(fullCommand);
            logger.info("Executing test command: " + String.join(" ", fullCommand));
        }

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Capture output
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                logger.info(line); // Log output in real-time
            }
        }

        // Wait for completion
        try {
            boolean finished = process.waitFor(300, TimeUnit.SECONDS); // 5-minute timeout
            if (!finished) {
                process.destroy();
                throw new IOException("Command timed out");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                String errorMessage = isShellCommand ? "Module installation failed" : "Test execution failed";
                throw new IOException(errorMessage + ". Exit code: " + exitCode + "\nOutput: " + output);
            }

            return output.toString();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Execution interrupted: " + e.getMessage(), e);
        }
    }
}