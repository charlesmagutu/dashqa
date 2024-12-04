package com.condabu.qadash.service;

import com.condabu.qadash.dto.ApiStatus;
import com.condabu.qadash.entity.ApiStatusHistory;
import com.condabu.qadash.entity.InternalApi;
import com.condabu.qadash.repository.ApiStatusHistoryRepository;
import com.condabu.qadash.repository.InternalApiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiMonitoringService {
    private final InternalApiRepository internalApiRepository;
    private final ApiStatusHistoryRepository statusHistoryRepository;
    //private final NotificationService notificationService;

    @Transactional
    public void updateApiStatus(Long apiId, ApiStatus newStatus, String reason) {
        InternalApi api = internalApiRepository.findById(apiId).orElseThrow();
        if (api.getStatus() != newStatus) {
            api.setStatus(newStatus);
            api.setLastStatusChange(LocalDateTime.now());

            ApiStatusHistory history = new ApiStatusHistory();
            history.setApi(api);
            history.setStatus(newStatus);
            history.setTimestamp(LocalDateTime.now());
            history.setReason(reason);

            statusHistoryRepository.save(history);
            internalApiRepository.save(api);

           // notificationService.notifyApiStatusChange(api);
        }
    }

    @Transactional(readOnly = true)
    public List<InternalApi> getAffectedApis() {
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
}