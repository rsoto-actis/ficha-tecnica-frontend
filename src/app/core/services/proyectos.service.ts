import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Output  } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {

  @Output() filters       : EventEmitter<any> = new EventEmitter();
  @Output() proyectToView : EventEmitter<any> = new EventEmitter();

  private url_base: string = environment.base_url;

  constructor(private http: HttpClient) {}

  public getAllProyects(): Observable<Array<any>> {
    return this.http.get<Array<any>>(
      `${this.url_base}proyectos/all`
    );
  }

  public getAllTowns(): Observable<Array<any>> {
    return this.http.get<Array<any>>(
      `${this.url_base}ficha-tecnica/towns`
    );
  }

  public getProyectsWithFilters( category : string, subcategory : string, initDate : string, endDate : string, type : string, town : number, prov : number ): Observable<Array<any>> {
    let json : any = {
      category    : category,
      subcategory : subcategory,
      init_date   : initDate,
      end_date    : endDate,
      type        : type,
      town        : town,
      prov        : prov
    };

    return this.http.post<Array<any>>(
      `${this.url_base}ficha-tecnica/`,
      json
    );
  }

  public insertTownsCategories( json : any ): Observable<Array<any>> {
    return this.http.post<Array<any>>(
      `${this.url_base}ficha-tecnica/towns-category`,
      json
    );
  }


  /*public putCicle(cicle: CicleModel): Observable<ResultModel> {
    return this.http.put<ResultModel>(
      `${this.url_base}/api/cicle`, cicle
    );
  }*/

  //-- No todos los proyectos tienen magnitud, lo que limita las respuestas del procedimiento almacenado. No se puede filtrar por "rural"
}
