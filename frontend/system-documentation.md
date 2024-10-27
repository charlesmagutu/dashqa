# Application Catalog System Documentation

## Overview
The Application Catalog System is a comprehensive solution for managing and visualizing application dependencies, APIs, and their impact relationships. The system helps organizations track their application landscape and quickly identify affected systems when issues occur.

## System Architecture

### Backend Components
1. **Spring Boot Application**
   - REST API endpoints for CRUD operations
   - Dependency analysis service
   - Health check monitoring
   - PostgreSQL database for persistence

2. **Data Model**
   - Applications
   - Features
   - APIs (Internal & Third-party)
   - Dependencies
   - Health status tracking

### Frontend Components
1. **React Application**
   - Interactive dependency visualization
   - Real-time status monitoring
   - Impact analysis visualization
   - Feature management interface

## API Documentation

### Applications
```
GET /api/v1/applications
POST /api/v1/applications
GET /api/v1/applications/{id}
PUT /api/v1/applications/{id}
DELETE /api/v1/applications/{id}
```

### Dependencies
```
GET /api/v1/applications/{id}/dependencies
POST /api/v1/applications/{id}/dependencies
DELETE /api/v1/applications/{id}/dependencies/{dependencyId}
```

### Impact Analysis
```
GET /api/v1/impact-analysis/api/{id}
GET /api/v1/impact-analysis/application/{id}
```

## Setup Instructions

1. **Backend Setup**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/app-catalog
   
   # Configure database
   cp application.properties.template application.properties
   # Edit database credentials
   
   # Run application
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Features

### Application Management
- Create and manage application entries
- Track application versions
- Monitor application health status
- Manage feature lists

### Dependency Tracking
- Visual dependency graph
- Direct and indirect dependency identification
- API consumption tracking
- Third-party integration management

### Impact Analysis
- Real-time API health monitoring
- Automatic impact detection
- Visual representation of affected systems
- Feature-level impact tracking

## Best Practices

1. **Adding New Applications**
   - Provide complete metadata
   - Configure health check endpoints
   - Document all dependencies
   - List all consumed APIs

2. **Monitoring**
   - Regular health check intervals
   - Alert threshold configuration
   - Impact severity classification
   - Recovery procedure documentation

3. **Maintenance**
   - Regular dependency review
   - API version tracking
   - Health check endpoint validation
   - Impact path verification

## Security Considerations

1. **Authentication**
   - JWT-based authentication
   - Role-based access control
   - API key management for integrations

2. **Data Protection**
   - Encrypted credentials storage
   - Secure API endpoints
   - Audit logging

## Troubleshooting

### Common Issues
1. **API Status Monitoring**
   - Health check timeout configuration
   - Network connectivity issues
   - Authentication failures

2. **Dependency Graph**
   - Circular dependency detection
   - Missing dependency documentation
   - Version compatibility issues

### Support
For additional support, contact:
- Technical Support: support@your-org.com
- Documentation: docs@your-org.com
