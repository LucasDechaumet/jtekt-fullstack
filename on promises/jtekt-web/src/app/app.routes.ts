import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
    data: { title: "Dashboard" },
  },
  {
    path: "",
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: "dashboard",
        title: "TC_MEANS - Dashboard",
        data: { title: "Dashboard" },
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "historique/:id",
        title: "TC_MEANS - Historique",
        data: { title: "Historique" },
        canActivate: [adminGuard],
        loadComponent: () =>
          import("./pages/historique/historique.component").then(
            (m) => m.HistoriqueComponent
          ),
      },
      {
        path: "parametres",
        title: "TC_MEANS - Paramètres",
        data: { title: "Paramètres" },
        canActivate: [adminGuard],
        loadComponent: () =>
          import("./pages/parametres/parametres.component").then(
            (m) => m.ParametresComponent
          ),
      },
      {
        path: "graphiques",
        title: "TC_MEANS - Graphiques",
        data: { title: "Graphiques" },
        canActivate: [adminGuard],
        loadComponent: () =>
          import("./pages/graphiques/graphiques.component").then(
            (m) => m.GraphiquesComponent
          ),
      },
    ],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },

  {
    path: "**",
    loadComponent: () =>
      import("./pages/unknown/unknown.component").then((m) => m.UnknownComponent),
  },
];
