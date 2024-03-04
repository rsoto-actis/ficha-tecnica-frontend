import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Output  } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {

  private url_base: string = environment.base_url;

  constructor(private http: HttpClient) {}

  public getAllItems(): Observable<Array<any>> {
    return this.http.get<Array<any>>(
      `${this.url_base}items/all`
    );
  }

  public getSubCategories( area_id : number ): Observable<Array<any>> {
    return this.http.get<Array<any>>(
      `${this.url_base}items/sub-item/${area_id}`
    );
  }

}