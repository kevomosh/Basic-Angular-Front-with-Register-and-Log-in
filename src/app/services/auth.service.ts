import { SignUpInfo } from "./../model/SignUpInfo";
import { User } from "./../model/User";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { Role } from "../model/Role";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private roles: Array<string> = [];

  private BASE_URL: string = "http://localhost:8080/api";
  private LOGIN_URL: string = `${this.BASE_URL}/auth/signin`;
  private REGISTER_URL: string = `${this.BASE_URL}/auth/signup`;

  private LoginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(
    localStorage.getItem("username")
  );
  private $Roles = new BehaviorSubject<string[]>([
    localStorage.getItem("roles")
  ]);

  checkLoginStatus(): boolean {
    let loginCookie = localStorage.getItem("loginStatus");
    if (loginCookie == "1") {
      return true;
    }
    return false;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.LOGIN_URL, { username, password }).pipe(
      map(result => {
        //login Successful
        if (result && result.token) {
          this.LoginStatus.next(true);
          localStorage.setItem("loginStatus", "1");
          localStorage.setItem("jwt", result.token);
          localStorage.setItem("username", result.username);
          localStorage.setItem("roles", JSON.stringify(result.authorities));
          this.UserName.next(localStorage.getItem("username"));
          this.$Roles.next([localStorage.getItem("roles")]);
        }
        return result;
      })
    );
  }

  register(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.REGISTER_URL, info, httpOptions);
  }

  logout() {
    this.LoginStatus.next(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.setItem("loginStatus", "0");
    this.router.navigate(["/login"]);
  }

  get isLoggedIn() {
    return this.LoginStatus.asObservable();
  }

  get currentUsername() {
    return this.UserName.asObservable();
  }

  get currentUserRoles() {
    return this.$Roles.asObservable();
  }
  // get currentUserRoles(): Observable<Role> {
  //   return this.$Roles.asObservable().pipe(map(r => r.authority));
  // }
}
