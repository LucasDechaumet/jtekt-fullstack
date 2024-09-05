import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);

  // Obtenez le token depuis le sessionStorage
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    // Si le token n'existe pas, redirigez vers la page de login
    router.navigate(["/login"]);
    return false;
  }

  try {
    // Décoder le token pour vérifier la date d'expiration
    const decodedToken: any = jwtDecode(token);

    // Vérifier si le token est expiré
    const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      // Si le token est expiré, redirigez vers la page de login
      sessionStorage.removeItem("authToken");
      router.navigate(["/login"]);
      return false;
    }

    // Si tout est en ordre, autorisez l'accès
    return true;
  } catch (error) {
    // Si une erreur survient (par exemple, token invalide), redirigez vers la page de login
    console.error("Invalid token", error);
    sessionStorage.removeItem("authToken");
    router.navigate(["/login"]);
    return false;
  }
};
