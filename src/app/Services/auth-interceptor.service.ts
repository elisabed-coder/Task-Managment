import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  authService: AuthService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        // console.log(user);
        if (!user || !user.token) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
    // now whenever a request will be made at that time first this auth query parameter will be set on each of this request and then observable will be returned
  }
}
