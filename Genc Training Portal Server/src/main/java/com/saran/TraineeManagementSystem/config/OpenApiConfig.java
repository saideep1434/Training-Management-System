package com.saran.TraineeManagementSystem.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
@Configuration
public class OpenApiConfig {
 
    @Bean
    OpenAPI customOpenAPI() {
		return new OpenAPI().info(new Info().title("Area Calculator")
				.version("1.0.0").description("Area Calculator for Shapes"));
				
	}
}

