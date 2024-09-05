package fr.akensys.jtekt_server.mean.models;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MeanMobileRequest {

    private String username;
    private String meanNumber;
    private String in_out;
    private LocalDateTime date;
}
