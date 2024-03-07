import { Component, HostListener, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  public closedSession : boolean = false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login(); 
    }
  }


  public loginData! : FormGroup;
  public message    : string  = "";
  public loginError : boolean = false;

  constructor(
    private router         : Router,
    private formBuilder    : FormBuilder,
    private authService    : AuthService,
    private genService     : GeneralService
  ) {

    this.loginData = this.formBuilder.group({
      username : new FormControl(),
      password : new FormControl()
    });
   }

  ngOnInit(): void {

    if ( localStorage.getItem('expired-session') == 'yes' ){
      this.toggleClosedSession();
      localStorage.setItem('expired-session', 'no');
    }

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
      try{
        
        this.authService
          .login({
            username : this.loginData.value.username,
            password : this.loginData.value.password
          })
          .pipe(first())
          .subscribe(
            ( result : any ) => {
              if ( result.token != null && result.token != "" ){
                localStorage.setItem('token', result.token);

                this.router.navigateByUrl('/dashboard');

                this.loginError = false;
              }
              else{
                this.loginError = true;
                this.message    = "Credenciales incorrectas.";   
              }
              

            },
            ( error : any) => {
              console.log(error)
              try{
                
                /*let json = JSON.parse(error.error.text.replace("\'","\"").replace("\'","\"").replace("\'","\"").replace("\'","\""));

                localStorage.setItem('token', json.token);

                this.router.navigateByUrl('/dashboard');

                this.loginError = false;*/
              }
              catch(e){
                console.log(e)
                this.loginError = true;
                //this.message = error.error.text; 
                this.message    = "Error de servidor, por favor contacte a soporte.";             
              }
              
            }
          );
      }
      catch(e){
        console.log(e)
        this.loginError = true;
        this.message    = "Error de servidor, por favor contacte a soporte.";
      }

        /* bvenegas - gore123456*/
      /*localStorage.setItem('token','aaaa');
      this.loginError = false;
      this.router.navigateByUrl('/dashboard');*/
    }
  }

  public toggleClosedSession(){
    this.closedSession = !this.closedSession;
  }

  


}
