import { Component, OnInit } from '@angular/core';

import { navItems } from './_nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = navItems;

  constructor(
    private router : Router,
  ) {}

  ngOnInit(): void {

    /* Redirije en caso de no haber token */
    if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
      
    }
    else{
      //this.router.navigateByUrl('/login');
    }
  }
}
