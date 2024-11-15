package com.condabu.qadash.controller;


import com.condabu.qadash.dto.ApiStatus;
import com.condabu.qadash.entity.InternalApi;
import com.condabu.qadash.service.ApiMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/apis")
@RequiredArgsConstructor
public class ApiController {
    private final ApiMonitoringService apiMonitoringService;

    @PostMapping("/{id}/status")
    public ResponseEntity<Void> updateApiStatus(
            @PathVariable Long id,
            @RequestParam ApiStatus status,
            @RequestParam(required = false) String reason) {
        apiMonitoringService.updateApiStatus(id, status, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/affected")
    public ResponseEntity<List<InternalApi>> getAffectedApis() {
        return ResponseEntity.ok(apiMonitoringService.getAffectedApis());
    }
}
