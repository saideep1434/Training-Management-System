package com.saran.TraineeManagementSystem.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.hibernate.validator.internal.util.logging.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
// Removed: import org.springframework.security.core.userdetails.UserDetailsService; // No longer needed for injection to avoid cycle
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.lang.System.Logger;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    // Removed: private final UserDetailsService userDetailsService; // This caused the circular dependency

    // Modified Constructor: Only injects JwtTokenProvider
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JwtAuthenticationFilter.class); // Define logger

//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//    	 String requestURI = request.getRequestURI();
//         logger.debug("--- JWT Filter: Processing request for URI: " + requestURI); // Debug log
//
//    	try {
////            String jwt = getJwtFromRequest(request);
//    		
//    		String bearerToken = request.getHeader("Authorization");
//            logger.debug("--- JWT Filter: Authorization Header: " + bearerToken); // Log the raw header
//
//            
//            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
//                String username = jwtTokenProvider.getUsernameFromJwt(jwt);
//                List<String> roles = jwtTokenProvider.getRolesFromJwt(jwt);
//                
//                // Create authorities from roles found in JWT
//                List<SimpleGrantedAuthority> authorities = roles.stream()
////                        .map(SimpleGrantedAuthority::new) // Roles are already "ROLE_NAME"
//                		.map(role -> new SimpleGrantedAuthority("ROLE_" + role))
//                        .collect(Collectors.toList());
//
//                // Create the Authentication object directly from JWT claims
//                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//                        username,  // Principal (username string)
//                        null,      // Credentials (JWT is already validated, no password needed here)
//                        authorities // Granted Authorities (roles)
//                );
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//            }
//        } catch (Exception ex) {
//            logger.error("Could not set user authentication in security context", ex);
//        }
//        filterChain.doFilter(request, response);
//    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        logger.debug("--- JWT Filter: Processing request for URI: " + requestURI); // Debug log

        try {
            String bearerToken = request.getHeader("Authorization");
            logger.debug("--- JWT Filter: Authorization Header: " + bearerToken); // Log the raw header

            String jwt = null;
            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                jwt = bearerToken.substring(7); // Remove "Bearer " prefix
                logger.debug("--- JWT Filter: Extracted JWT from header: " + jwt.substring(0, Math.min(jwt.length(), 40)) + "..."); // Log partial JWT
            } else {
                logger.warn("--- JWT Filter: Authorization header missing or not in 'Bearer ' format for URI: " + requestURI);
            }

            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                logger.debug("--- JWT Filter: Token is valid. Proceeding with authentication for URI: " + requestURI);
                String username = jwtTokenProvider.getUsernameFromJwt(jwt);
                List<String> roles = jwtTokenProvider.getRolesFromJwt(jwt);
                logger.debug("--- JWT Filter: Username: " + username + ", Roles: " + roles);

                List<SimpleGrantedAuthority> authorities = roles.stream()
                        // This assumes roles from JWT already have "ROLE_" prefix.
                        // If your roles in JWT are just "ADMIN", you need to add "ROLE_" here.
                        // If your JWT roles are "ROLE_ADMIN", then just map to SimpleGrantedAuthority directly.
                        .map(SimpleGrantedAuthority::new) // Check this line carefully with your JWT payload
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, null, authorities
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                logger.warn("--- JWT Filter: Token validation failed or token not found for URI: " + requestURI + ". Token: " + jwt);
            }
        } catch (Exception ex) {
            logger.error("--- JWT Filter: Error during authentication for URI: " + requestURI, ex);
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}