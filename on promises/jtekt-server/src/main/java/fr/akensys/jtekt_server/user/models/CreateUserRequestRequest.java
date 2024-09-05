package fr.akensys.jtekt_server.user.models;

import lombok.Data;

@Data
public class CreateUserRequestRequest {

    private String firstname;

    private String lastname;

    private String email;

    private String password;

    private String role;
}

