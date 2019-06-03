import { AuthService } from "./../../services/auth.service";
import { SignUpInfo } from "./../../model/SignUpInfo";
import { FormControl, NgForm } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  form: any = {};

  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignupFailed = false;
  errorMessage = "";

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}
  onSubmit() {
    this.signupInfo = new SignUpInfo(
      this.form.name,
      this.form.username,
      this.form.email,
      this.form.password
    );

    this.auth.register(this.signupInfo).subscribe(
      data => {
        console.log(data);
        this.router.navigate(["/login"]);
        this.isSignedUp = true;
        this.isSignupFailed = false;
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSignupFailed = true;
      }
    );
  }
}
