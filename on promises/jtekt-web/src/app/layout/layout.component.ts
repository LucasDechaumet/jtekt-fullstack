import { Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from "./components/header/header.component";
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './components/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  public sidebarService = inject(SidebarService);

}
