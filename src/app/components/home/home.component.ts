import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Observable, pipe } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  LogInStatus$: Observable<boolean>;
  roles: string[];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.LogInStatus$ = this.auth.isLoggedIn;
    this.auth.currentUserRoles.subscribe(r => (this.roles = r));
  }

  displayRoles() {
    return this.roles;
  }
}
