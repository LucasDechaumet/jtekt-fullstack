import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/api/auth.service";
import { ToastModule } from "primeng/toast";
import { RippleModule } from "primeng/ripple";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    RippleModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  loading: boolean = false;
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.authService.signIn(this.email, this.password).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.router.navigate(["/dashboard"]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        this.showError();
      },
    });
  }

  showError() {
    this.messageService.add({
      severity: "error",
      summary: "Connexion échouée",
      detail: this.errorMessage,
      key: "bc",
      life: 3000,
    });
  }
}
