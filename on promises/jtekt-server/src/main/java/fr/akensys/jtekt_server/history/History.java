package fr.akensys.jtekt_server.history;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import fr.akensys.jtekt_server.mean.Mean;
import fr.akensys.jtekt_server.mean.enums.State;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Mean mean;

    private String username;
    private LocalDateTime created_at;
    private State in_out;
    private Long duration_out;
    private Long duration_in;
}
