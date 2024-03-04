import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken  = environment.jwt;

    let clone;
    if(idToken) {
      clone = request.clone({
        setHeaders: {
          authorization: `Bearer ${idToken}`
        }
      }); 
      
        
    } else {
      clone = request;
    }

    return next.handle(clone).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          //          this.router.navigateByUrl('/login');
        }
        if (err.status >= 401 || err.status === 0) {
          //
            
        }                   
        return throwError( err );

      })
    );  
  }
}