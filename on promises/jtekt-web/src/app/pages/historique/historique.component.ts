import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { MeanService } from "../../services/api/mean.service";
import { History } from "../../interfaces/history";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ButtonModule,
    TooltipModule,
  ],
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  id: string | null = null;
  data: History[] = [];
  loading: boolean = false;
  globalFilterFields: string[] = ["nom", "date", "etat"];

  constructor(private route: ActivatedRoute, private meanService: MeanService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id !== null) {
      this.meanService.getHistory(this.id).subscribe({
        next: (data: any) => {
          this.data = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
