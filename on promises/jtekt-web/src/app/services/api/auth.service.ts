import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly tokenKey = "authToken";

  constructor(private http: HttpService, private router: Router) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>("/auth/authenticate", { email, password }).pipe(
      map((response) => {
        if (response.token) {
          this.setToken(response.token);
          return { success: true, token: response.token };
        } else {
          throw new Error("Invalid response");
        }
      }),
      catchError((error) => {
        let errorMessage =
          "Impossible de se connecter veuillez contacter le service informatique";
        if (error.error.message === "Bad credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserRole(): string[] {
    try {
      const token = this.getToken();
      if (!token) {
        return [];
      }
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.authorities || [];
    } catch (error) {
      console.error("Invalid token", error);
      return [];
    }
  }

  signOut() {
    this.clearToken();
    this.router.navigate(["/login"]);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
