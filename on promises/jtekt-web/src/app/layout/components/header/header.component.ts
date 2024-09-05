import { Component, inject } from "@angular/core";
import { SidebarService } from "../sidebar/sidebar.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";

import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  public height: string = "1.5rem";
  public sidebarService = inject(SidebarService);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
  public moduleTitle: string;

  cities: any[] | undefined;

  selectedCity: any | undefined = { name: "New York", code: "NY" };

  constructor() {
    // Subscribe to router events to handle navigation changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        map((route) => route.snapshot.data)
      )
      .subscribe((data: any) => {
        this.moduleTitle = data["title"];
      });

    this.cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];
  }

  onToggleSidebar(): void {
    this.sidebarService.setSidebarState(!this.sidebarService.getSidebarState);
  }
}
