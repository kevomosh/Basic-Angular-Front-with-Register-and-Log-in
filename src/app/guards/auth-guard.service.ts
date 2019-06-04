import { Router } from "@angular/router";
import { AuthService } from "./../services/auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  roles: string[];

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.isLoggedIn.pipe(
      take(1),
      map((loginStatus: boolean) => {
        const destination: string = state.url;

        //Get Roles.
        this.auth.currentUserRoles.subscribe(r => (this.roles = r));

        //Check log in status
        if (!loginStatus) {
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }

        this.roles.every(role => {
          switch (destination) {
            case "/user": {
              if (role === "ROLE_ADMIN" || role === "ROLE_USER") {
                return true;
              }
            }

            case "/admin": {
              if (role === "ROLE_USER") {
                this.router.navigate(["/access-denied"]);
                return false;
              }
              if (role === "ROLE_ADMIN") {
                return true;
              }
            }

            default:
              return false;
          }
        });
      })
    );
  }
}
