// Domain Models

@Entity
@Data
@NoArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private String version;
    private String status;
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Set<Feature> features = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "app_dependencies",
        joinColumns = @JoinColumn(name = "app_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private Set<Application> dependencies = new HashSet<>();
    
    @ManyToMany
    private Set<ThirdPartyApi> thirdPartyApis = new HashSet<>();
}

@Entity
@Data
@NoArgsConstructor
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private String status;
    
    @ManyToOne
    private Application application;
    
    @ManyToMany
    private Set<Api> consumedApis = new HashSet<>();
}

@Entity
@Data
@NoArgsConstructor
public class Api {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String endpoint;
    private String status;
    private String healthCheckEndpoint;
    
    @ManyToOne
    private Application owner;
}

@Entity
@Data
@NoArgsConstructor
public class ThirdPartyApi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String provider;
    private String endpoint;
    private String status;
    private String healthCheckEndpoint;
}

// Services

@Service
@Slf4j
public class DependencyAnalysisService {
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private ApiRepository apiRepository;
    
    public Set<Application> getAffectedApplications(Long apiId) {
        Api api = apiRepository.findById(apiId)
            .orElseThrow(() -> new ResourceNotFoundException("API not found"));
            
        Set<Application> affected = new HashSet<>();
        
        // Find directly affected applications through features
        affected.addAll(
            applicationRepository.findByFeaturesConsumerApisContaining(api)
        );
        
        // Find applications affected through dependencies
        Set<Application> dependentApps = new HashSet<>();
        affected.forEach(app -> {
            dependentApps.addAll(findDependentApplications(app));
        });
        
        affected.addAll(dependentApps);
        return affected;
    }
    
    private Set<Application> findDependentApplications(Application app) {
        Set<Application> dependents = applicationRepository
            .findByDependenciesContaining(app);
            
        Set<Application> allDependents = new HashSet<>(dependents);
        dependents.forEach(dependent -> {
            allDependents.addAll(findDependentApplications(dependent));
        });
        
        return allDependents;
    }
}

// Controllers

@RestController
@RequestMapping("/api/v1")
public class CatalogController {
    @Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private DependencyAnalysisService dependencyAnalysisService;
    
    @GetMapping("/applications")
    public List<Application> getAllApplications() {
        return applicationService.findAll();
    }
    
    @GetMapping("/applications/{id}/dependencies")
    public Map<String, Object> getApplicationDependencies(@PathVariable Long id) {
        Application app = applicationService.findById(id);
        return Map.of(
            "direct", app.getDependencies(),
            "apis", app.getFeatures().stream()
                .flatMap(f -> f.getConsumedApis().stream())
                .collect(Collectors.toSet()),
            "thirdParty", app.getThirdPartyApis()
        );
    }
    
    @GetMapping("/impact-analysis/api/{id}")
    public Set<Application> getApiImpactAnalysis(@PathVariable Long id) {
        return dependencyAnalysisService.getAffectedApplications(id);
    }
}
