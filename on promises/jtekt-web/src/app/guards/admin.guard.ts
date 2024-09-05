import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Obtenez le token depuis le sessionStorage
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    // Si le token n'existe pas, redirigez vers la page de login
    router.navigate(["/login"]);
    return false;
  }

  try {
    // Décoder le token pour vérifier les rôles
    const decodedToken: any = jwtDecode(token);

    // Vérifier si l'utilisateur a le rôle 'admin'
    if (decodedToken.authorities && decodedToken.authorities.includes("admin")) {
      return true; // L'utilisateur est admin, autoriser l'accès
    } else {
      // Sinon, rediriger vers une page non autorisée ou le dashboard
      router.navigate(["/dashboard"]);
      return false;
    }
  } catch (error) {
    // Si une erreur survient (par exemple, token invalide), redirigez vers la page de login
    console.error("Invalid token", error);
    sessionStorage.removeItem("authToken");
    router.navigate(["/login"]);
    return false;
  }
};
