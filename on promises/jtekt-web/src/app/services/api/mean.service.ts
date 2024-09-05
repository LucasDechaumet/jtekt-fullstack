import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MeanService {
  endpoint = "/mean";
  constructor(private http: HttpService) {}

  deleteMean(meanNumber: string) {
    return this.http.delete(`${this.endpoint}/delete/${meanNumber}`);
  }

  addMeanFromExcel(data: any) {
    return this.http.post(`${this.endpoint}/addMeansFromExcel`, data);
  }

  getMeans() {
    return this.http.get(`${this.endpoint}/getMeans`);
  }

  getHistory(meanCode: string) {
    return this.http.get(`${this.endpoint}/getHistory/${meanCode}`);
  }

  getAllMeansType() {
    return this.http.get(`${this.endpoint}/getAllMeansType`);
  }

  getMeansNumberByType(type: string) {
    return this.http.get(`${this.endpoint}/getMeansNumberByType/${type}`);
  }

  getMeansWithinInterval(
    startDate: string,
    endDate: string,
    type: string,
    meanNumber?: string
  ) {
    let url = `${this.endpoint}/getMeansWithinInterval?startDate=${startDate}&endDate=${endDate}&type=${type}`;
    if (meanNumber) {
      url += `&meanNumber=${meanNumber}`;
    }
    return this.http.get(url);
  }

  getFakeData() {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            duration_in: 2000,
            duration_out: 2800,
            name: "CODEUR ANGULAIRE HEIDENHAIM ERN 1020 2048 01",
          },
          {
            duration_in: 2000,
            duration_out: null,
            name: "CODEUR LINEAIRE HEIDENHAIM LC 183 2048 02",
          },
          {
            duration_in: 2000,
            duration_out: 470,
            name: "CODEUR ROTATIF RENISHAW RGH22Y 2048 03",
          },
          {
            duration_in: 2000,
            duration_out: 3150,
            name: "CAPTEUR DE POSITION INDUCTIF IFM IG533A 04",
          },
          {
            duration_in: 2000,
            duration_out: 3500,
            name: "CODEUR ABSOLU SICK AFS60A-S4LC262144 05",
          },
          {
            duration_in: 2000,
            duration_out: 2000,
            name: "CAPTEUR DE TEMPERATURE PT100 CLASSE B 06",
          },
          {
            duration_in: 2000,
            duration_out: 500,
            name: "CAPTEUR ULTRASON IFM UGT511 07",
          },
          {
            duration_in: 2000,
            duration_out: 700,
            name: "CAPTEUR LASER SICK DT35-B15251 08",
          },
          {
            duration_in: 2000,
            duration_out: 900,
            name: "ACCELEROMETRE PCB PIEZOTRONICS 352C33 09",
          },
          {
            duration_in: 2000,
            duration_out: 1200,
            name: "CAPTEUR DE FORCE KISTLER 9217A 10",
          },
        ]);
        observer.complete(); // Indicate that the observable has finished emitting values
      }, 1000);
    });
  }
}
