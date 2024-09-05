import { Component, ElementRef, Renderer2, ViewChild, inject } from "@angular/core";
import { SidebarService } from "./sidebar.service";
import { ISidebarItem } from "./ISidebarItem";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/api/auth.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent {
  public sidebarService: SidebarService = inject(SidebarService);
  public sidebarConfig = this.sidebarService.sidebarConfig;
  public router: Router = inject(Router);
  items: ISidebarItem[] = [
    {
      title: "Application",
      children: [
        {
          title: "Dashboard",
          icon: "pi-list",
          path: "/dashboard",
        },
        {
          title: "Graphiques",
          icon: "pi-chart-line",
          path: "/graphiques",
        },
      ],
    },
    {
      title: "Mon compte",
      children: [
        {
          title: "Paramètres",
          icon: "pi-cog",
          path: "/parametres",
        },
        {
          title: "Déconnexion",
          icon: "pi-sign-out",
          path: "/signout",
        },
      ],
    },
  ];
  logoPaths = {
    logoFull: "assets/img/jtekt-big-logo.png",
    logoSingle: "assets/img/jtekt-small-logo.png",
  };
  logoPath: string =
    window.innerWidth > 991 ? this.logoPaths.logoSingle : this.logoPaths.logoFull;
  constructor(private renderer: Renderer2, private authService: AuthService) {
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen("window", "click", (e: any) => {
      if (
        !document.getElementById("sidebar-toggle")?.contains(e.target) &&
        !document.getElementById("sidebar")?.contains(e.target)
      ) {
        this.sidebarService.setSidebarState(false);
      }
    });
  }

  onToggleSidebar(state: boolean): void {
    this.sidebarService.setSidebarState(state);
    this.logoPath = state ? this.logoPaths.logoFull : this.logoPaths.logoSingle;
  }

  onHoverSidebar(state: boolean) {
    if (!this.sidebarService.getSidebarState) {
      this.logoPath = state ? this.logoPaths.logoFull : this.logoPaths.logoSingle;
    }
  }

  onItemClick(item: ISidebarItem): void {
    if (item?.children?.length) {
      item.collapsed = !item.collapsed;
    } else if (item.path === "/signout") {
      this.authService.signOut();
    } else {
      this.router.navigateByUrl(item.path as any);
    }
  }
}
