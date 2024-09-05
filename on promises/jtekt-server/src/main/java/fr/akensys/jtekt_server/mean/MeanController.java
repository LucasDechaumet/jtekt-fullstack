package fr.akensys.jtekt_server.mean;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.akensys.jtekt_server.history.History;
import fr.akensys.jtekt_server.mean.models.MeanMobileRequest;
import fr.akensys.jtekt_server.mean.models.MeanWebRequest;
import fr.akensys.jtekt_server.mean.models.MeanWebResponse;
import fr.akensys.jtekt_server.mean.models.MeanWithinIntervalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/mean")
public class MeanController {

    private final MeanService meanService;

    @DeleteMapping("/delete/{meanNumber}")
    public void deleteMean(@PathVariable String meanNumber) {
        meanService.deleteMean(meanNumber);
    }

    @GetMapping("/getMeans")
    public List<MeanWebResponse> getMeans() {
        return meanService.getMeans();
    }

    @GetMapping("/getHistory/{meanNumber}")
    public List<History> getHistory(@PathVariable String meanNumber) {
        return meanService.getHistory(meanNumber);
    }

    @PostMapping("/addMeansFromExcel")
    public void addMeansFromExcel(@RequestBody List<MeanWebRequest> means) {
        meanService.addMeansFromExcel(means);
    }

    @GetMapping("/getAllMeansType")
    public List<String> getAllMeansType() {
        return meanService.getAllMeansType();
    }

    @GetMapping("/getMeansNumberByType/{type}")
    public List<String> getMeansNumberByType(@PathVariable String type) {
        return meanService.getMeansNumberByType(type);
    }

    @GetMapping("/getMeansWithinInterval")
    public List<MeanWithinIntervalResponse> getMeansWithinInterval(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate, @RequestParam String type, @RequestParam(required = false) String meanNumber) {
        System.out.println("startDate: " + startDate + " endDate: " + endDate + " type: " + type + " meanNumber: " + meanNumber);
        return meanService.getMeansWithinInterval(startDate, endDate, type, meanNumber);
    }

    @PostMapping("/addMeansFromMobile")
    public void addMeansFromMobile(@RequestBody List<MeanMobileRequest> means) {
        meanService.addMeansFromMobile(means);
    }
    

}
