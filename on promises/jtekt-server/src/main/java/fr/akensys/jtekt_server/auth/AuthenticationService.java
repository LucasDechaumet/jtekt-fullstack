package fr.akensys.jtekt_server.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import fr.akensys.jtekt_server.security.JwtService;
import fr.akensys.jtekt_server.user.User;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;



        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                var auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

                var claims = new HashMap<String, Object>();
                var user = ((User) auth.getPrincipal());
                claims.put("fullName", user.getFullName());

                var jwtToken = jwtService.generateToken(claims, (User) auth.getPrincipal());
                return AuthenticationResponse.builder()
                        .token(jwtToken)
                        .build();
        }
}