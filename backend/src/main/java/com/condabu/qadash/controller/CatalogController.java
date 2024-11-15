package com.condabu.qadash.controller;

import com.condabu.qadash.entity.Application;
import com.condabu.qadash.service.ApplicationService;
import com.condabu.qadash.service.DependencyAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("api/v1")
public class CatalogController {
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    DependencyAnalysisService dependencyAnalysisService;
    @GetMapping("/applications")
    public Map<String, Object> getAllApplications() {
        return null;
    }

    @GetMapping("/applications/{id}/dependencies")
    public Map<String, Object> getApplicationDependencies(@PathVariable("id") Long id) {

//        Optional<Application> app = applicationService.findById(id);
//
//        return Map.of("direct", app.ge(),
//                "apis", appGetFeatures().stream()
//                        .flatMap(f -> f.getConsumedApis().stream())
//                        .collect(Collection.toSet()),
//                "thirdParty", app.getThirdPartyApis()
//        );
        return null;
    }

    @GetMapping("/impact-analysis/api/{id}")
    public Set<Application> getImpactAnalysis(@PathVariable("id") Long id) {
//        return dependencyAnalysisService.getAffectedApplications(id);
        return null;
    }
}