import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Output  } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url_base: string = environment.base_url;

  constructor(private http: HttpClient) {}

  public login( credentials : any ){
    return this.http.post<Array<any>>(
        `${this.url_base}auth/login`,
        credentials
    );
  }

}