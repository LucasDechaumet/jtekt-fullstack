import { Injectable } from "@angular/core";
import { ISidebarItem } from "./ISidebarItem";
import { BehaviorSubject, Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  sidebarDisplayState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  sidebarConfig = {
    defaultColor: "rgba(41, 50, 65, .8)",
    activeColor: "#14b8a6",
    hoverColor: "#14b8a6",
    width: "3rem",
  };
  constructor(private http: HttpClient) {}

  get getSidebarState(): boolean {
    return this.sidebarDisplayState.value;
  }

  setSidebarState(state: boolean): void {
    this.sidebarDisplayState.next(state);
  }
}
