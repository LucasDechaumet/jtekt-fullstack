package fr.akensys.jtekt_server.history;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepo extends JpaRepository<History, Long> {

}
