package fr.akensys.jtekt_server.role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepo roleRepo;

    @Transactional
    public void createRole(String name) {
        Role role = Role.builder().name(name).build();
        roleRepo.save(role);
    }

}
