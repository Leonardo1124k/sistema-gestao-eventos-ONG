package com.sistema.reservas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // O "/**" aplica a regra para TODAS as rotas (/eventos, /produtos, etc)
                .allowedOrigins(
                    "http://localhost:5500",        // Para seus testes locais com Live Server
                    "http://127.0.0.1:5500",        // Para seus testes locais com Live Server
                    "https://leonardo1124k.github.io" // Substitua pelo link real do seu GitHub Pages
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // O OPTIONS é o que resolve o bloqueio prévio do navegador!
                .allowedHeaders("*") // O "*" permite que o header 'ngrok-skip-browser-warning' passe sem problemas
                .allowCredentials(false);
    }
}