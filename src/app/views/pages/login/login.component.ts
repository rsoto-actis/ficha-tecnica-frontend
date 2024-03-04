import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{


  public loginData! : FormGroup;
  public message    : string  = "";
  public loginError : boolean = false;

  constructor(
    private router         : Router,
    private formBuilder    : FormBuilder
  ) {

    this.loginData = this.formBuilder.group({
      username : new FormControl(),
      password : new FormControl()
    });
   }

  ngOnInit(): void {

      if ( localStorage.getItem('token') != "" && localStorage.getItem('token') != null ){
        this.router.navigateByUrl('/dashboard');
      }
  }

  public showPublicData(){
    this.router.navigateByUrl('/public-data');
  }

  public login(){
    this.loginError = false;
    if ( this.loginData.value.username == '' ){
      this.loginError = true;
      this.message    = "Debe ingresar un nombre de usuario.";
    }

    else if ( this.loginData.value.password == '' ){
      this.loginError = true;
      this.message    = "Debe ingresar una contraseña.";
    }

    else if ( this.loginData.value.username != '' && this.loginData.value.password != '' ){ 
      localStorage.setItem('token','aaaa');
      this.loginError = false;
      this.router.navigateByUrl('/dashboard');
    }
  }

  


}
