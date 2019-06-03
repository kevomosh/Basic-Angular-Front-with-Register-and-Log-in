import { LoginInfo } from "./../../model/LoginInfo";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  private loginInfo: LoginInfo;
  insertForm: FormGroup;
  Username: FormControl;
  Password: FormControl;
  returnUrl: string;
  ErrorMessage: string;
  InvalidLogin: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.Username = new FormControl("", [Validators.required]);
    this.Password = new FormControl("", [Validators.required]);

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    this.insertForm = this.fb.group({
      Username: this.Username,
      Password: this.Password
    });
  }

  onSubmit() {
    let userLogin = this.insertForm.value;
    this.auth.login(userLogin.Username, userLogin.Password).subscribe(
      result => {
        let token = (<any>result).token;
        console.log(token);

        console.log(result.authorities);
        console.log("User Logged in Successfully");
        this.InvalidLogin = false;
        console.log(this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      },
      error => {
        this.InvalidLogin = true;
        this.ErrorMessage = "Invalid details supplied";
      }
    );
  }
}
