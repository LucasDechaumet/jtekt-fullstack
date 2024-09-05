package fr.akensys.jtekt_server.mean.models;

import java.time.LocalDateTime;

import fr.akensys.jtekt_server.mean.enums.State;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MeanWebResponse {

    private String storage;
    private String serial_number;
    private String licence_number;
    private String name;
    private String type;
    private String meanNumber;
    private State in_out;
    private String username;
    private LocalDateTime lastDate;

}
