import { Injectable, EventEmitter, Output  } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

    @Output() selectedTown : EventEmitter<any> = new EventEmitter();
    @Output() percents     : EventEmitter<any> = new EventEmitter();

    constructor() {}


}