import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  LogInStatus$: Observable<boolean>;
  currentUserRoles$: Observable<string[]>;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.LogInStatus$ = this.auth.isLoggedIn;
    this.currentUserRoles$ = this.auth.currentUserRoles;
  }
}
