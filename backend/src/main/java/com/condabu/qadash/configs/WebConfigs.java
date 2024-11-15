package com.condabu.qadash.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigs implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "DELETE", "PUT", "POST","OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);       
    }
}
