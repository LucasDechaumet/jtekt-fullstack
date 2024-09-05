package fr.akensys.jtekt_server.role;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<String> createRole(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        roleService.createRole(name);
        return ResponseEntity.ok("Role created successfully");
    }
}
