package com.petshop.config;

import com.petshop.security.AuthEntryPointJwt;
import com.petshop.security.AuthTokenFilter;
import com.petshop.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOriginPatterns(java.util.List.of("*"));
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()

                        // Public product and category endpoints
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/brands/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sizes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product-types/**").permitAll()

                        // Public address endpoints
                        .requestMatchers(HttpMethod.GET, "/api/addresses/provinces").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/addresses/districts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/addresses/wards/**").permitAll()

                        // Public promotion endpoints
                        .requestMatchers(HttpMethod.GET, "/api/promotions").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promotions/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promotions/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promotions/applicable").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/promotions/validate-coupon").permitAll()

                        // Public order tracking
                        .requestMatchers(HttpMethod.GET, "/api/orders/{id}/tracking").permitAll()

                        // Cart endpoints - require authentication
                        .requestMatchers("/api/cart/**").authenticated()

                        // Order endpoints - authenticated users
                        .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/my-orders").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/orders/{id}/cancel").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/{id}").authenticated()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/promotions").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/promotions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/promotions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/promotions/{id}/toggle").hasRole("ADMIN")

                        // Employee and Admin endpoints
                        .requestMatchers("/api/employee/**").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/{id}/status").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/{id}").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.GET, "/api/orders/status/**").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.POST, "/api/orders/{id}/confirm").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.POST, "/api/orders/{id}/ship").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.POST, "/api/orders/{id}/complete").hasAnyRole("ADMIN", "NHÂN VIÊN")

                        // Product management - Admin and Employee
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "NHÂN VIÊN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        // Category, Brand, Size, ProductType management - Admin only
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/brands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/brands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/brands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/sizes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/sizes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sizes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/product-types/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/product-types/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/product-types/**").hasRole("ADMIN")

                        // User management
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/{id}/toggle-status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/{id}/reset-password").hasRole("ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}