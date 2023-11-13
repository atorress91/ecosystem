import { AuthService } from 'src/app/core/service/authentication-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Response } from '@app/core/models/response-model/response.model';
import { ToastrService } from 'ngx-toastr';
declare var particlesJS: any;

import { Signin } from '@app/core/models/signin-model/signin.model';
import { LogoService } from '@app/core/service/logo-service/logo.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  submitted = false;
  returnUrl: string;
  error = '';
  loading = false;
  hide = true;
  logoUrl: string;
  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService, private logoService: LogoService) {
  }

  ngOnInit() {
    this.getTheme();
    this.authService.logoutUser();
    particlesJS.load('particles-js', 'assets/particles/particles.json', function () {
    });
  }

  authLogin = new FormGroup({
    remeber: new FormControl('', []),
    email: new FormControl('', [Validators.required]),
    pwd: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  });

  loginSubmitted() {
    this.loading = true;
    let signin = new Signin();
    this.submitted = true;
    this.error = '';
    signin.userName = this.authLogin.value.email;
    signin.password = this.authLogin.value.pwd;
    this.authService.loginUser(signin).subscribe((response: Response) => {
      if (response.success) {
        if (response.data.is_affiliate) {
          this.router.navigate(['/app/home']);
        } else {
          this.router.navigate(['admin/home-admin']);
        }
      } else {
        this.showError(response.message);
      }
      this.loading = false;
    });
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  get f() {
    return this.authLogin.controls;
  }

  get Email(): FormControl {
    return this.authLogin.get('email') as FormControl;
  }

  get Pwd(): FormControl {
    return this.authLogin.get('pwd') as FormControl;
  }

  getTheme() {
    this.logoUrl = this.logoService.getLogoSrc();
  }
}
