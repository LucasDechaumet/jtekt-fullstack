package fr.akensys.jtekt_server.mean;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import fr.akensys.jtekt_server.history.History;
import fr.akensys.jtekt_server.mean.enums.State;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String storage;
    private String serial_number;
    private String licence_number;
    private String type;
    private String name;
    private State in_out;
    private LocalDateTime lastDate;
    private String meanNumber;
    private boolean error;
    
@JsonManagedReference
    @OneToMany(mappedBy = "mean", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<History> histories;

}
