package com.condabu.qadash.service;

import com.condabu.qadash.entity.Application;
import com.condabu.qadash.entity.Feature;
import com.condabu.qadash.repository.ApplicationRepository;
import com.condabu.qadash.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class DependencyAnalysisService {

    private final ApplicationRepository applicationRepository;

    private final FeatureRepository featureRepository;

    public Map<String, Object> analyzeImpact(Long applicationId) {
        Application app = applicationRepository.findByIdWithDependencies(applicationId).orElse(null);

        List<Application> dependentApps = applicationRepository.findDependentApplications(app);
        List<Feature> affectedFeatures = featureRepository.findAffectedFeatures();

        Map<String, Object> impact = new HashMap<>();
        impact.put("affectedApplications", dependentApps);
        impact.put("affectedFeatures", affectedFeatures);
        impact.put("totalImpact", calculateImpactScore(dependentApps, affectedFeatures));

        return impact;
    }

    private double calculateImpactScore(List<Application> apps, List<Feature> features) {
        
        return 0.0; 
    }

}
