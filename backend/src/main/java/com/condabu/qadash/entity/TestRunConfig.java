package com.condabu.qadash.entity;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestRunConfig {

    private String runId;
    private String environment;
    private String browser;
    private boolean dryRun;
    private boolean log;
    private boolean report;
    private boolean output;
    private List<String> includeTags;
    private List<String> excludeTags;
    private boolean captureScreenshot;
    private boolean videoRecording;
    private String scriptPath;
    private boolean headless;
}
