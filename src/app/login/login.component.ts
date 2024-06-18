import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;

  errorMessage: string | null = null;

  authObs!: Observable<AuthResponse>;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onFormSubmitted(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    // check if we are in login mode
    if (this.isLoginMode) {
      this.isLoading = true;
      this.authObs = this.authService.login(email, password);
    } else {
      this.isLoading = true;
      this.authObs = this.authService.signup(email, password);
    }
    this.authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        //redirect the user after login
        this.router.navigate(['/Tasks']);
      },
      error: (errMsg) => {
        this.isLoading = false;
        this.errorMessage = errMsg;
        this.hideSnackbar();
      },
    });
    this.isLoading = true;

    form.reset();
  }

  //hide snackbar in 3 sec.
  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
