import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router     } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { jwtDecode  } from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let clone;
    const idToken  = localStorage.getItem('token');

    if ( idToken != '' && idToken != null ){
      let decoded   = jwtDecode(localStorage.getItem('token') + "");
      let exp       = new Date(parseInt(decoded.exp + "") * 1000);
      let timestamp = new Date();
      

      if ( exp.getTime() <= timestamp.getTime() ) {
        localStorage.clear();
        localStorage.setItem('expired-session','yes');
        this.router.navigateByUrl('/login');
        clone = request;
        return next.handle(clone).pipe(
          catchError((err: HttpErrorResponse) => { 
            return throwError( err );

          })
        );
      } 
      else{
        
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

    else{
      clone = request;
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
}