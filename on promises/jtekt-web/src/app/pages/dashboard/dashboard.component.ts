import { CommonModule } from "@angular/common";
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { SpeedDialModule } from "primeng/speeddial";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ExcelData } from "../../interfaces/excel-data";
import { AuthService } from "../../services/api/auth.service";
import { MeanService } from "../../services/api/mean.service";
import { Mean } from "../../interfaces/mean";

@Component({
  selector: "app-dashboard",
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
    SpeedDialModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [ConfirmationService, MessageService],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("fileInput") fileInput!: ElementRef;
  roles: string[] = [];
  items: any[] = [
    {
      icon: "pi pi-download",
      label: "Download",
      tooltipOptions: {
        tooltipLabel: "Télécharger Modèle Excel",
        tooltipPosition: "left",
      },
      command: () => {
        this.createAndDownloadExcelFile();
      },
    },
    {
      icon: "pi pi-plus",
      label: "Ajouter",
      tooltipOptions: {
        tooltipLabel: "Ajouter un Excel de Moyen",
        tooltipPosition: "left",
      },
      command: () => {
        this.triggerFileInput();
      },
    },
    {
      icon: "pi pi-refresh",
      label: "Refresh",
      tooltipOptions: { tooltipLabel: "Actualiser", tooltipPosition: "left" },
      command: () => {
        window.location.reload();
      },
    },
  ];

  data: Mean[] = [];

  loading: boolean = true;
  globalFilterFields: string[] = [
    "storage",
    "serial_number",
    "licence_number",
    "name",
    "type",
    "meanNumber",
    "in_out",
    "username",
    "lastDate",
  ];
  multiSortMeta: any[] = [
    { field: "storage", order: 1 },
    { field: "meanNumber", order: 1 },
  ];

  columnExcel: any = [
    ["N°Armoire", "N° SERIE", "N° LICENCE", "DESIGNATION", "TYPE", "CODE", "ETAT"],
  ];

  FILENAME = "dataTemplate.xlsx";
  COLUMNWIDTH = 30;
  COLUMNCOUNT = 7;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private meanService: MeanService
  ) {}

  ngOnInit(): void {
    this.roles = this.authService.getUserRole();
    this.meanService.getMeans().subscribe({
      next: (data: any) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  // Implémentation de AfterViewInit pour s'assurer que fileInput est initialisé
  ngAfterViewInit(): void {
    if (!this.fileInput) {
      console.error("File input could not be initialized.");
    }
  }

  // Méthode pour déclencher l'input de fichier
  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error("File input not available.");
    }
  }

  // Méthode pour gérer l'upload
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extractJSONfromExcelFile(file).then(
        (JSONdata) => {
          this.loading = true;
          this.meanService.addMeanFromExcel(JSONdata).subscribe({
            next: (data: any) => {
              this.messageService.add({
                severity: "info",
                summary: "Confirmation",
                detail: "Les moyens ont été ajoutés",
                life: 1500,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            error: (error) => {
              console.error(error);
              this.loading = false;
              this.messageService.add({
                severity: "error",
                summary: "Erreur",
                detail: "Les moyens n'ont pas pu être ajoutés",
                life: 1500,
              });
            },
          });
        },
        (error) => {
          console.error("Erreur lors de l'extraction des données JSON :", error);
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Les moyens n'ont pas pu être ajoutés",
            life: 1500,
          });
        }
      );
    }
  }

  onRowClicked(event: MouseEvent, product: Mean) {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Du texte est sélectionné, ne rien faire
      return;
    }
    this.router.navigate(["/historique", product.meanNumber]);
  }

  createAndDownloadExcelFile() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.columnExcel);

    const colWidths = Array(this.COLUMNCOUNT).fill({ width: this.COLUMNWIDTH });
    worksheet["!cols"] = colWidths;

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, this.FILENAME);
  }

  extractJSONfromExcelFile(file: File): Promise<ExcelData[]> {
    return new Promise((resolve, reject) => {
      if (!file) {
        console.error("Aucun fichier sélectionné.");
        reject("Aucun fichier sélectionné.");
        return;
      }

      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const data: any = new Uint8Array(e.target.result);
        const workbook: XLSX.WorkBook = XLSX.read(data, {
          type: "array",
          dateNF: "yyyy-mm-dd",
        });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

        const excelData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet, {
          header: "A",
          rawNumbers: false,
          defval: null,
        });
        resolve(excelData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  deleteProduct(product: Mean, event: any) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Voulez-vous vraiment supprimer ${product.meanNumber} ?`,
      header: "Confirmation de suppression",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.meanService.deleteMean(product.meanNumber).subscribe({
          next: () => {
            this.data = this.data.filter((p) => p.meanNumber !== product.meanNumber);
            this.messageService.add({
              severity: "info",
              summary: "Confirmation",
              detail: "Le moyen a été supprimé",
              life: 1500,
            });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Le moyen n'a pas pu être supprimé",
              life: 1500,
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "error",
          summary: "Annulation",
          detail: "Suppression annulée",
          life: 1500,
        });
      },
    });
  }
}
