import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RoutingModule } from './routing/routing.module';

import { AppComponent } from './app.component';
import { AngularFontAwesomeModule} from 'angular-font-awesome';
import { FooterComponent } from './footer/footer.component';
import { ConfigService } from './config.service';
import { HeaderComponent } from './header/header.component';

import { UserService } from './user.service';

import { CustomMaterialModule } from './material.module';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpInterceptorService} from './http-interceptor.service';

@NgModule({
  imports:[ 
      RoutingModule,
      BrowserModule, 
      FormsModule,
      AngularFontAwesomeModule,
      NgbCollapseModule,
      CustomMaterialModule,
      ReactiveFormsModule,
      HttpClientModule  // must be after BrowserModule
    ],
    declarations: [
      AppComponent,
      FooterComponent,
      HeaderComponent,  
      LoginComponent,
      WelcomeComponent
    ],
    // provided services are singleton (except if declared in components)
    providers: [
      ConfigService,
      UserService,
      { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
