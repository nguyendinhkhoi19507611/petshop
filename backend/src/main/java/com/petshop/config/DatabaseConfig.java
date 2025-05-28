package com.petshop.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.petshop.repository")
@EntityScan(basePackages = "com.petshop.entity")
@EnableTransactionManagement
public class DatabaseConfig {
}