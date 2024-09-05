package fr.akensys.jtekt_server.mean;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MeanRepo extends JpaRepository<Mean, Long> {

    @Query(value = "SELECT * FROM jtekt.mean WHERE mean_number = :meanNumber", nativeQuery = true)
    Optional<Mean> findByMeanNumber(String meanNumber);

    @Query(value = "SELECT DISTINCT type FROM jtekt.mean", nativeQuery = true)
    List<String> getAllMeansType();

    @Query(value = "SELECT mean_number FROM jtekt.mean where type = :type", nativeQuery = true)
    List<String> getMeansNumberByType(@Param("type") String type);

    @Query(value = "SELECT m.mean_number AS meanNumber, m.name AS name, " +
    "SUM(h.duration_out) AS duration_out, " +
    "SUM(h.duration_in) AS duration_in " +
    "FROM jtekt.mean m " +
    "LEFT JOIN jtekt.history h ON m.id = h.mean_id " +
    "WHERE h.created_at BETWEEN :startDate AND :endDate " +
    "AND m.type = :type " +
    "GROUP BY m.mean_number, m.name", nativeQuery = true)
    List<Object[]> getMeansWithinInterval(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("type") String type);

    @Query(value = "SELECT m.mean_number AS meanNumber, m.name AS name, " +
    "SUM(h.duration_out) AS duration_out, " +
    "SUM(h.duration_in) AS duration_in " +
    "FROM jtekt.mean m " +
    "LEFT JOIN jtekt.history h ON m.id = h.mean_id " +
    "WHERE h.created_at BETWEEN :startDate AND :endDate " +
    "AND m.type = :type " +
    "AND m.mean_number = :meanNumber " +
    "GROUP BY m.mean_number, m.name", nativeQuery = true)
    List<Object[]> getMeansWithinIntervalAndMeanNumber(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("type") String type, @Param("meanNumber") String meanNumber);

}
