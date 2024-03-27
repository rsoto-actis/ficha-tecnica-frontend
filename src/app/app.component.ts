import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { GeneralService } from './core/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {

  private interval : any;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.lastMovement = null!;
    this.lastMovement = new Date();
  }

  public  title        : string  = 'Ficha Técnica';
  private lastMovement : Date    = new Date();

  constructor(
    private router         : Router,
    private titleService   : Title,
    private iconSetService : IconSetService,
    private genService     : GeneralService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnDestroy(): void {
      clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.genService.closeSessionConfirm.subscribe( ( data : any ) => {
      if ( data.data ){
        this.lastMovement = null!;
        this.lastMovement = new Date();
      }
    })
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.interval = setInterval( () => {
      if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
        let date = new Date();
        let diff = ( date.getTime() - this.lastMovement.getTime() ) / 1000;
        //console.log(diff)
        if ( diff > environment.close_session_timeout ){

          this.genService.closeSessionAdvice.emit({
            data : true 
          })
          //localStorage.clear();
          //this.router.navigateByUrl('/login');
        }
      }

    }, 30000)
  }
}
