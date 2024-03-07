import { Component, OnDestroy, OnInit } from '@angular/core';

import { navItems       } from './_nav';
import { Router         } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';
import { jwtDecode      } from "jwt-decode";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  public interval1 : any;

  public navItems = navItems;

  public visible           : boolean = false;
  public askCloseSession   : boolean = false;
  public closeSessionTimer : number  = 31;
  public closeSessionOn    : boolean = false;

  constructor(
    private router  : Router,
    private genServ : GeneralService,
  ) {}

  /* Close session ask */

  toggleAskCloseSession() {
    this.askCloseSession = !this.askCloseSession;
  }

  handleAskCloseSession(event: any) {
    this.askCloseSession = event;
  }

  mantainSession(){
    this.closeSessionTimer = 31;
    this.closeSessionOn    = false;
    this.toggleAskCloseSession();
    this.genServ.closeSessionConfirm.emit({
      data : true
    })
  }

  public confirmLogout(){
    localStorage.setItem('token', '');
    this.router.navigateByUrl('/login');
  }

  /* END Close session ask */

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }


  ngOnDestroy(): void {
      clearInterval(this.interval1);
  }
  

  ngOnInit(): void {

    this.genServ.closeSessionAdvice.subscribe( ( data : any ) => {
      if ( data.data ){
        this.closeSessionOn  = true;
        this.askCloseSession = true;
      }
    })

    this.interval1 = setInterval( () =>{
      if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
        if ( this.closeSessionOn ){
          this.closeSessionTimer = this.closeSessionTimer - 1;
          
          if ( this.closeSessionTimer == 0 ){
            this.closeSessionOn    = false;
            setTimeout( () => {
              localStorage.clear();
              this.router.navigateByUrl('/login');

              localStorage.setItem('expired-session','yes');
              
            }, 2000)
          }
        
        }
      }
      
    }, 1000)

    this.genServ.logout.subscribe( ( data : any ) => {
      if ( data ){
        this.toggleLiveDemo();
      }
    })
    /* Redirije en caso de no haber token */
    if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
      let decoded   = jwtDecode(localStorage.getItem('token') + "");
      let exp       = new Date(parseInt(decoded.exp + "") * 1000);
      let timestamp = new Date();
      
      if ( exp.getTime() <= timestamp.getTime() ) {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      } 
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }
}
