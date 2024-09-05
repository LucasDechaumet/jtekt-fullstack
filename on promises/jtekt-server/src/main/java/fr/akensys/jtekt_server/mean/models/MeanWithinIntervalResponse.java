package fr.akensys.jtekt_server.mean.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class MeanWithinIntervalResponse {

    private String meanNumber;

    private String name;

    private Long duration_out;

    private Long duration_in;

}
