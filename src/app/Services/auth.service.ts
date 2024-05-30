// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AuthResponse } from '../Model/AuthResponse';
// import { Observable, catchError, throwError } from 'rxjs';
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   error: string | null = null;
//   constructor(private http: HttpClient) {}
//   signup(
//     email: string,
//     password: string,
//     returnSecureToken: true
//   ): Observable<AuthResponse> {
//     const data = {
//       email: email,
//       password: password,
//     };
//     return this.http
//       .post<AuthResponse>(
//         'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAA7TiEOwRrkjGL5W5CFCKQA2sWg-vRO1k',
//         data
//       )
//       .pipe(
//         catchError((err) => {
//           let erroMessage = 'An unkown error happened';
//           if (!err.error || !err.error.error) {
//             return throwError(() => erroMessage);
//           }
//           switch (err.error.error.message) {
//             case 'EMAIL_EXISTS':
//               this.error = 'This email already exists';

//               break;
//           }
//           throwError(() => err);
//         })
//       );
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // error: string | null = null;
  //one extra feature which behavioralsubject provcies is that also gives aus previous emitted data, so we'll also have access to previously emitted data
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<AuthResponse> {
    const data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
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
  login(email: String, password: string) {
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
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = ' This email does not exist';
        break;
      case 'INVALID_PASSWORD ':
        errorMessage = 'The password is invalid';
        break;
      // case 'INVALID_LOGIN_CREDENTIALS':
      //   errorMessage = 'The email ID or Password is not correct';
      //   break;
    }
    return throwError(() => errorMessage);
  }
}
