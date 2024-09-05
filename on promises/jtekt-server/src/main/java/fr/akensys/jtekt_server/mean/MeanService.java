package fr.akensys.jtekt_server.mean;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import fr.akensys.jtekt_server.history.History;
import fr.akensys.jtekt_server.mean.enums.State;
import fr.akensys.jtekt_server.mean.models.MeanMobileRequest;
import fr.akensys.jtekt_server.mean.models.MeanWebRequest;
import fr.akensys.jtekt_server.mean.models.MeanWebResponse;
import fr.akensys.jtekt_server.mean.models.MeanWithinIntervalResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MeanService {

    private final MeanRepo meanRepo;

    public void deleteMean(String meanNumber) {
        Mean mean = meanRepo.findByMeanNumber(meanNumber).orElseThrow(() -> new IllegalArgumentException("Mean not found"));
        meanRepo.delete(mean);
    }

    @Transactional
    public List<MeanWebResponse> getMeans() {
        List<Mean> means = meanRepo.findAll();
        List<MeanWebResponse> meanWebResponses = new ArrayList<>();
        for (Mean mean : means) {
            List<History> histories = mean.getHistories();
            meanWebResponses.add(MeanWebResponse.builder()
                    .storage(mean.getStorage())
                    .serial_number(mean.getSerial_number())
                    .licence_number(mean.getLicence_number())
                    .name(mean.getName())
                    .type(mean.getType())
                    .meanNumber(mean.getMeanNumber())
                    .in_out(mean.getIn_out())
                    .username(histories.get(histories.size() - 1).getUsername())
                    .lastDate(mean.getLastDate())
                    .build());
        }
        return meanWebResponses;
    }

    @Transactional
    public List<History> getHistory(String meanNumber) {
        Mean mean = meanRepo.findByMeanNumber(meanNumber).orElseThrow(() -> new IllegalArgumentException("Mean not found"));
        Hibernate.initialize(mean.getHistories());
        return mean.getHistories();
    }

    public void addMeansFromExcel(List<MeanWebRequest> means) {
        try {
            // Remove the header of the Excel file
            means.remove(0);
            for (MeanWebRequest meanRequest : means) {
                Mean mean = Mean.builder()
                        .storage(meanRequest.getA())
                        .serial_number(meanRequest.getB())
                        .licence_number(meanRequest.getC())
                        .name(meanRequest.getD())
                        .type(meanRequest.getE())
                        .meanNumber(meanRequest.getF())
                        .in_out(State.valueOf(meanRequest.getG()))
                        .lastDate(LocalDateTime.now())
                        .histories(new ArrayList<>())
                        .error(false)
                        .build();
                History history = History.builder()
                        .mean(mean)
                        .created_at(LocalDateTime.now())
                        .username("")
                        .in_out(State.valueOf(meanRequest.getG()))
                        .build();
                mean.getHistories().add(history);
                meanRepo.save(mean);
            }
        } catch (Exception e) {
            System.err.println(e);
        }
    }

     public List<String> getAllMeansType() {
        return meanRepo.getAllMeansType();
    }

    public List<String> getMeansNumberByType(String type) {
        return meanRepo.getMeansNumberByType(type);
    }

    public List<MeanWithinIntervalResponse> getMeansWithinInterval(LocalDate startDate, LocalDate endDate, String type, String meanNumber) {
    List<Object[]> results = new ArrayList<>();
    if (meanNumber == null) {
        results = meanRepo.getMeansWithinInterval(startDate, endDate, type);
    } else {
        results = meanRepo.getMeansWithinIntervalAndMeanNumber(startDate, endDate, type, meanNumber);
    }

    // Mapper les résultats en objets MeanWithinIntervalResponse en gérant la conversion BigDecimal -> Long
    return results.stream()
            .map(result -> MeanWithinIntervalResponse.builder()
                    .meanNumber((String) result[0])
                    .name((String) result[1])
                    .duration_out(result[2] != null ? ((BigDecimal) result[2]).longValue() : 0L) // Conversion de BigDecimal en Long
                    .duration_in(result[3] != null ? ((BigDecimal) result[3]).longValue() : 0L)   // Conversion de BigDecimal en Long
                    .build())
            .toList();
    }

    public Long getDuration(LocalDateTime currentDate, LocalDateTime lastDate) {
        Duration duration = Duration.between(lastDate, currentDate);
        Long durationInMinutes = duration.toMinutes();
        return durationInMinutes;
    }
    
    @Transactional
    public void addMeansFromMobile(List<MeanMobileRequest> means) {
    for (MeanMobileRequest meanRequest : means) {
        // Vérifier si meanNumber est vide ou null
        if (meanRequest.getMeanNumber() == null || meanRequest.getMeanNumber().trim().isEmpty()) {
            continue; // Ignore ce mean et passe au suivant
        }

        
        Optional<Mean> optionalMean = meanRepo.findByMeanNumber(meanRequest.getMeanNumber());
        if (optionalMean.isPresent()) {
            Mean mean = optionalMean.get();
            
            mean.setIn_out(State.valueOf(meanRequest.getIn_out()));
            mean.setLastDate(meanRequest.getDate());
            List<History> history = mean.getHistories();
            LocalDateTime lastDate = history.get(history.size() - 1).getCreated_at();
            
            Long currentDuration = getDuration(meanRequest.getDate(), lastDate);

            History newHistory = History.builder()
                    .mean(mean)
                    .username(meanRequest.getUsername())
                    .created_at(meanRequest.getDate())
                    .in_out(State.valueOf(meanRequest.getIn_out()))
                    .duration_in(meanRequest.getIn_out().equals("S") ? currentDuration : null)
                    .duration_out(meanRequest.getIn_out().equals("E") ? currentDuration : null)
                    .build();
            history.add(newHistory);
            
            meanRepo.save(mean);
        } else {
            
            Mean newMean = Mean.builder()
                    .meanNumber(meanRequest.getMeanNumber())
                    .in_out(State.valueOf(meanRequest.getIn_out()))
                    .lastDate(meanRequest.getDate())
                    .type("ERROR")
                    .error(true) // Set error to true
                    .build();

            History newHistory = History.builder()
                    .mean(newMean)
                    .username(meanRequest.getUsername())
                    .created_at(meanRequest.getDate())
                    .in_out(State.valueOf(meanRequest.getIn_out()))
                    .build();

            List<History> history = new ArrayList<>();
            history.add(newHistory);
            newMean.setHistories(history);
            meanRepo.save(newMean);
        }
    }
}

}
