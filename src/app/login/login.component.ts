import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import {MatDialog} from '@angular/material';

// Structures for API responses
interface UserJsonDatas {
  username: string;
  token: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
public loginForm: FormGroup;
public loading = false;

public username: string;
public password: string;

public authentErrorMsg: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private http: HttpClient) { }

  ngOnInit() {
    // Init of the form fields
    this.loginForm = this.formBuilder.group({
      'usernameField': new FormControl(null,
       [Validators.required, Validators.email, Validators.maxLength(17)]),
      'passwordField': new FormControl(null,
       [Validators.required, Validators.maxLength(6)]),
});
    
    // A redirection to the login page will always logout the user
    if (this.userService.isLogged()) {
      this.logout();
    }
  }

  // Form error messages are managed here
  getErrorMessage(field: string) {
    return this.loginForm.get(field).hasError('required') ? 'This field is required' :
        (this.loginForm.get(field).hasError('email') ? 'This field must be a valid email' :
            (this.loginForm.get(field).hasError('maxlength') ? 'This field is size limited' :
            ''));
  }

  // Convenience getter for easy access to form fields
  get formCont() { return this.loginForm.controls; }

  // The function which executes when the user clicks on the login button
  // Here for local mockup
  login(): void {   
    this.username = this.loginForm.get('usernameField').value;
    this.password = this.loginForm.get('passwordField').value; 
    console.log('login attempt for: ' + this.username);
    
    this.authentErrorMsg = null;
    this.userService.login(this.username, this.password);
    
    if (this.userService.user) {
      this.router.navigate(['/welcome']);
    } else {
      this.authentErrorMsg = 'Authentication error, wrong credentials';
    }
  }

  // The function which executes when the user clicks on the login button
  // Here for API mockup (real http call)
  loginHttp() {
    this.username = this.loginForm.get('usernameField').value;
    this.password = this.loginForm.get('passwordField').value;

    console.log('login HTTP for: ' + this.username);
    this.authentErrorMsg = null;
    this.loading = true;

    this.postCredentials()
    .pipe(first())  // ensure one entrance
    .subscribe(
      () => {
      this.loading = false;
      if (this.userService.user) {
        this.router.navigate(['/welcome']);
        } else {
        this.authentErrorMsg = 'Authentication error, wrong credentials';
        }
      },
     // see http interceptor for code about errors management
     error => {
       this.loading = false;
       this.authentErrorMsg = error;
     });
  }

  // The function which calls the API in https
  postCredentials(): Observable<UserJsonDatas> {
    return this.http.post<UserJsonDatas>('https://devdays.getsandbox.com/authent',
      {username: this.username, password: this.password})
      .pipe(
      map((datas: UserJsonDatas) => {
        if (datas && datas.username && datas.token) {
        console.log('API says authent is OK');
        this.userService.logUser(datas.username, datas.token);
        }
      return datas;
      })
    );
  }

  logout(): void {
    console.log('logout');
    this.userService.resetUser();
  }

}