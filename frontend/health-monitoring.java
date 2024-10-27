// Health Monitoring Service
@Service
@Slf4j
public class HealthMonitoringService {
    @Autowired
    private ApiRepository apiRepository;
    
    @Autowired
    private ThirdPartyApiRepository thirdPartyApiRepository;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Scheduled(fixedRate = 60000) // Check every minute
    public void monitorApiHealth() {
        WebClient webClient = WebClient.builder()
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
            
        // Monitor internal APIs
        apiRepository.findAll().forEach(api -> {
            try {
                checkApiHealth(api, webClient);
            } catch (Exception e) {
                log.error("Error checking API health: " + api.getName(), e);
                updateApiStatus(api, "DOWN");
            }
        });
        
        // Monitor third-party APIs
        thirdPartyApiRepository.findAll().forEach(api -> {
            try {
                checkThirdPartyApiHealth(api, webClient);
            } catch (Exception e) {
                log.error("Error checking third-party API health: " + api.getName(), e);
                updateThirdPartyApiStatus(api, "DOWN");
            }
        });
    }
    
    private void checkApiHealth(Api api, WebClient webClient) {
        try {
            webClient.get()
                .uri(api.getHealthCheckEndpoint())
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(5))
                .block();
                
            updateApiStatus(api, "UP");
        } catch (Exception e) {
            updateApiStatus(api, "DOWN");
            throw e;
        }
    }
    
    private void checkThirdPartyApiHealth(ThirdPartyApi api, WebClient webClient) {
        try {
            webClient.get()
                .uri(api.getHealthCheckEndpoint())
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(5))
                .block();
                
            updateThirdPartyApiStatus(api, "UP");
        } catch (Exception e) {
            updateThirdPartyApiStatus(api, "DOWN");
            throw e;
        }
    }
    
    private void updateApiStatus(Api api, String status) {
        String previousStatus = api.getStatus();
        api.setStatus(status);
        apiRepository.save(api);
        
        if (!status.equals(previousStatus)) {
            eventPublisher.publishEvent(new ApiStatusChangeEvent(api));
        }
    }
    
    private void updateThirdPartyApiStatus(ThirdPartyApi api, String status) {
        String previousStatus = api.getStatus();
        api.setStatus(status);
        thirdPartyApiRepository.save(api);
        
        if (!status.equals(previousStatus)) {
            eventPublisher.publishEvent(new ThirdPartyApiStatusChangeEvent(api));
        }
    }
}

// Event Handlers
@Component
@Slf4j
public class ApiStatusEventHandler {
    @Autowired
    private DependencyAnalysisService dependencyAnalysisService;
    
    @Autowired
    private NotificationService notificationService;
    
    @EventListener
    public void handleApiStatusChange(ApiStatusChangeEvent event) {
        Api api = event.getApi();
        if ("DOWN".equals(api.getStatus())) {
            Set<Application> affectedApps = 
                dependencyAnalysisService.getAffectedApplications(api.getId());
                
            // Send notifications
            notificationService.notifyApiDown(api, affectedApps);
            
            // Update metrics
            updateMetrics(api, affectedApps);
        }
    }
    
    private void updateMetrics(Api api, Set<Application> affectedApps) {
        // Record incident start time
        IncidentRecord incident = new IncidentRecord();
        incident.setApi(api);
        incident.setStartTime(LocalDateTime.now());
        incident.setAffectedApplications(affectedApps.size());
        incidentRepository.save(incident);
    }
}

// Notification Service
@Service
@Slf4j
public class NotificationService {
    @Value("${slack.webhook.url}")
    private String slackWebhookUrl;
    
    @Value("${email.notification.enabled}")
    private boolean emailEnabled;
    
    public void notifyApiDown(Api api, Set<Application> affectedApps) {
        String message = createNotificationMessage(api, affectedApps);
        
        // Send Slack notification
        sendSlackNotification(message);
        
        // Send email if enabled
        if (emailEnabled) {
            sendEmailNotification(message);
        }
    }
    
    private String createNotificationMessage(Api api, Set<Application> affectedApps) {
        return String.format(
            "🔴 API Down Alert: %s\n" +
            "Affected Applications: %d\n" +
            "Impact: %s\n" +
            "Time: %s",
            api.getName(),
            affectedApps.size(),
            affectedApps.stream()
                .map(Application::getName)
                .collect(Collectors.joining(", ")),
            LocalDateTime.now()
        );
    }
}
