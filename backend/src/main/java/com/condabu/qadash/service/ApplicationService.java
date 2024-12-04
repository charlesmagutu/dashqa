package com.condabu.qadash.service;

import com.condabu.qadash.dto.ApiStatus;
import com.condabu.qadash.entity.Application;
import com.condabu.qadash.entity.InternalApi;
import com.condabu.qadash.repository.ApplicationRepository;
import com.condabu.qadash.repository.InternalApiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final InternalApiRepository internalApiRepository;

    @Transactional(readOnly = true)
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }


    @Transactional
    public Application updateApplication(Long id, Application application) {
        Application existing = getApplicationById(id);
        existing.setName(application.getName());
        existing.setDescription(application.getDescription());
        existing.setVersion(application.getVersion());
        existing.setOwningTeam(application.getOwningTeam());
        return applicationRepository.save(existing);
    }

    @Transactional
    public void updateApiStatus(Long apiId, ApiStatus newStatus, String reason) {
        InternalApi api = internalApiRepository.findById(apiId).orElse(null);
        if(api.getStatus() != newStatus) {
            api.setStatus(newStatus);
            api.setLastStatusChange(LocalDateTime.now());
        }

    }
    @Transactional(readOnly = true)
    public List<InternalApi> getAffectedApis(){
        return internalApiRepository.findByStatus(ApiStatus.DOWN);
    }

    public void checkApiHealth(InternalApi api) {
        // Implementation of health check logic
        try {
            // Perform health check call
            boolean isHealthy = performHealthCheck(api);
            updateApiStatus(api.getId(),
                    isHealthy ? ApiStatus.UP : ApiStatus.DOWN,
                    isHealthy ? "Health check passed" : "Health check failed");
        } catch (Exception e) {
            updateApiStatus(api.getId(), ApiStatus.UNKNOWN, "Health check error: " + e.getMessage());
        }
    }

    private boolean performHealthCheck(InternalApi api) {
        // Implementation of actual health check logic
        return true; // Placeholder
    }

    @Transactional
    public Application createApplication(Application application) {
        return applicationRepository.save(application);
    }

    @Transactional
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
