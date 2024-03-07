import { Injectable, EventEmitter, Output  } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {

    @Output() logout              : EventEmitter<any> = new EventEmitter();
    @Output() closeSessionAdvice  : EventEmitter<any> = new EventEmitter();
    @Output() closeSessionConfirm : EventEmitter<any> = new EventEmitter();
    @Output() expiredSession      : EventEmitter<any> = new EventEmitter();

  constructor() {}


}