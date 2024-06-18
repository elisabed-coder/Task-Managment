import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../Model/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //one extra feature which behavioralsubject provcies is that also gives us previous emitted data, so we'll also have access to previously emitted data
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<AuthResponse> {
    const data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    // console.log(data);
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAA7TiEOwRrkjGL5W5CFCKQA2sWg-vRO1k',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  login(email: String, password: string): Observable<AuthResponse> {
    const data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAA7TiEOwRrkjGL5W5CFCKQA2sWg-vRO1k',
        data
      )
      .pipe(
        catchError(this.handleError),
        //here we are creating new user based on the response data which we are going to receive
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  //create user
  private handleCreateUser(res: any) {
    //this will return us the time stamp of the expiry time
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;

    //this time stamp we want to convert into date and time
    const expiresIn = new Date(expiresInTs);

    const user = new User(res.email, res.localId, res.idToken, expiresIn);
    //this user will be emitted  eith subject(next), it can be accessed anywhere in application
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/login']);
    // clear only user data from localstorage
    localStorage.removeItem('user');
  }

  autoLogin() {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      return;
    }

    const userData: {
      email: string;
      id: string;
      _token: string;
      _expiresIn: string;
    } = JSON.parse(userDataString);

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._expiresIn)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  // handle error
  private handleError(err: any) {
    let errorMessage = 'An unknown error has occured';
    console.log(err);
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'This operation is not allowed.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The email ID or Password is not correct.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
