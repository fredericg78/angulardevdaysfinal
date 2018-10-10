import { Injectable } from '@angular/core';

// The User session object 
export class User {
  private static instance:User = null;
  
  userName: string;
  token: string;

  private constructor(userName: string, token?: string) {
    this.userName = userName;
    if (token) {
      this.token = token;
    }
  }

  public static userSingletonConstructor(userName: string, token?: string): User {
    if (User.instance == null) {
       User.instance = new User(userName, token);
      }

    return User.instance;    
    }
}

// User service to inject in components
@Injectable()
export class UserService {

  public user: User;

  constructor() {
    this.user = null;
   }

  // To check if user is logged
  public isLogged(): boolean {
    return this.user !== null;
  }

  // Internal mockup to authenticate the user
  public login(userName: string, password: string) {
     if (userName === 'admin@orange.com' && password === 'admin')
     {
      console.log('Credentials are OK');
      this.logUser(userName);
     } else {
       console.log('Credentials are NOK');
       this.user = null;
     }
   }

  // To log the user (creation of the user session)
  public logUser(userName: string, token?: string) {
    if (this.user == null) {
      this.user = User.userSingletonConstructor(userName, token);
    }
  }

  // To destroy the user session
  public resetUser() {
     this.user = null;
   }

}