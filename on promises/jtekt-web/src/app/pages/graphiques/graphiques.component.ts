import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { ChartModule } from "primeng/chart";
import { CommonModule } from "@angular/common";
import { MeanService } from "../../services/api/mean.service";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: "app-graphiques",
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CalendarModule, ChartModule],
  templateUrl: "./graphiques.component.html",
  styleUrls: ["./graphiques.component.scss"],
})
export class GraphiquesComponent implements OnInit {
  types: any[] = [];
  selectedType: any;
  codes: any[] | undefined;
  selectedCode: any;
  rangeDates: any;
  selectedRangeDates: Date[] | undefined;
  rangeDateInMinutes: number | undefined;
  basicData: any;
  basicOptions: any;
  data: any;

  constructor(private meanService: MeanService) {}

  ngOnInit(): void {
    this.meanService.getAllMeansType().subscribe({
      next: (response: any) => {
        this.types = response.map((type: string) => ({ name: type, code: type }));
      },
      error: (error) => {
        console.error("Error fetching types:", error);
      },
    });

    this.data = [
      { name: "Mean 1", duration_out: 20 },
      { name: "Mean 2", duration_out: 30 },
      { name: "Mean 3", duration_out: 40 },
      { name: "Mean 4", duration_out: 50 },
      { name: "Mean 5", duration_out: 60 },
    ];

    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: "start",
          align: "end",
          color: "black",
          rotation: -90,
          formatter: (value: any, context: any) => {
            return context.chart.data.labels[context.dataIndex];
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 5,
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  onDateSelect() {
    if (this.rangeDates[1] !== null) {
      this.selectedRangeDates = this.rangeDates;
      if (this.selectedRangeDates) {
        this.rangeDateInMinutes = this.getMinutesBetweenDates(this.selectedRangeDates);
      }
      if (this.data && this.selectedType) {
        this.getData();
      }
    }
  }

  onTypeChange() {
    if (!this.selectedType) return;

    this.meanService.getMeansNumberByType(this.selectedType.code).subscribe({
      next: (response: any) => {
        this.getData();
        this.codes = response.map((code: string) => ({ name: code, code: code }));
      },
      error: (error) => {
        console.error("Error fetching codes:", error);
      },
    });
  }

  onCodeChange() {
    this.getData();
  }

  getMinutesBetweenDates(selectedRangeDates: Date[]): number {
    const startDate = selectedRangeDates[0];
    const endDate = selectedRangeDates[1];
    return Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
  }

  getData() {
    if (!this.selectedRangeDates || !this.selectedType) {
      console.warn("Required data not selected.");
      return;
    }

    const startDate = this.selectedRangeDates[0].toISOString().split("T")[0];
    const endDate = this.selectedRangeDates[1].toISOString().split("T")[0];
    const type = this.selectedType.name;
    const meanNumber = this.selectedCode ? this.selectedCode.name : null;

    this.meanService
      .getMeansWithinInterval(startDate, endDate, type, meanNumber)
      // .getFakeData()
      .subscribe({
        next: (response: any) => {
          const labels = response.map((item: any) => item.name);
          let data = response.map(
            (item: any) => (item.duration_out * 100) / (this.rangeDateInMinutes || 1)
          );

          // Update chart data
          this.basicData = {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                  "rgb(255, 159, 64)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                  "rgb(153, 102, 255)",
                  "rgb(255, 99, 132)",
                ],
                borderWidth: 2,
              },
            ],
          };
        },
        error: (error) => {
          console.error("Error fetching data:", error);
        },
      });
  }
}
