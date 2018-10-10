import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { WelcomeComponent } from '../welcome/welcome.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'}, // for the website root url
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },  // the welcome page is access protected (only for logged users), see auth.guard.ts
  { path: '**', redirectTo: '/login', pathMatch: 'full'},  // for unknown page
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    AuthGuard
  ]
})
export class RoutingModule { }