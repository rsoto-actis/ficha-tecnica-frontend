import { Injectable, EventEmitter, Output  } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {

    @Output() logout : EventEmitter<any> = new EventEmitter();

  constructor() {}


}