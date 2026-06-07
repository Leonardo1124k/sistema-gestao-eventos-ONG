package com.sistema.reservas.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Autenticação pública
                .requestMatchers("/api/admin/login", "/api/admin/cadastrar").permitAll()

                // Eventos públicos (leitura)
                .requestMatchers(HttpMethod.GET,
                        "/api/eventos",
                        "/api/eventos/abertos",
                        "/api/eventos/{id}",
                        "/api/eventos/status/{status}").permitAll()

                // EDIT PARA CONSULTA DE CLIENTES DO SISTEMA (RETIRAR DEPOIS)
                .requestMatchers(HttpMethod.GET,"/api/clientes").permitAll()

                //EDIT ALTERAR DADOS DE CLIENTE DO SISTEMA
                .requestMatchers(HttpMethod.PUT,"/api/clientes/{id}").permitAll()

                // Cadastro de cliente público
                .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()

                // Consulta de reserva por código (cliente confere sua reserva)
                .requestMatchers(HttpMethod.GET, "/api/reservas/codigo/{codigo}").permitAll()
                
                // EDIT Consulta de reservas, geral
                .requestMatchers(HttpMethod.GET, "/api/reservas").permitAll()

                // Criação de reserva pública e pagamento
                .requestMatchers(HttpMethod.POST, "/api/reservas", "/api/pagamentos").permitAll()

                // Produtos públicos (leitura)
                .requestMatchers(HttpMethod.GET, "/api/produtos", "/api/produtos/{id}").permitAll()

                // Tudo mais requer autenticação
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
