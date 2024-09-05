package fr.akensys.jtekt_server.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.akensys.jtekt_server.role.RoleRepo;
import fr.akensys.jtekt_server.user.models.CreateUserRequestRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createUser(CreateUserRequestRequest request) {
        var userRole = roleRepo.findByName(request.getRole())
                .orElseThrow(() -> new IllegalStateException("Role not found"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(true)
                .role(userRole)
                .build();
        userRepo.save(user);
    }

}
