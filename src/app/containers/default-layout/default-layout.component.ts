import { Component, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = navItems;

  public visible : boolean = false;

  constructor(
    private router  : Router,
    private genServ : GeneralService,
  ) {}

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  public confirmLogout(){
    localStorage.setItem('token', '');
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {

    this.genServ.logout.subscribe( ( data : any ) => {
      if ( data ){
        this.toggleLiveDemo();
      }
    })

    /* Redirije en caso de no haber token */
    if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
      
    }
    else{
      this.router.navigateByUrl('/login');
    }
  }
}
