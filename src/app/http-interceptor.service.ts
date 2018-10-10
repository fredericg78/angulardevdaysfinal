import { Injectable } from '@angular/core';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';
import { UserService } from './user.service';
import {Router} from '@angular/router';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
              private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {

    let reqHeaders = req.headers;
    reqHeaders = reqHeaders.set('Accept', 'application/json');

    // Here it is possible to add an authentication token on every request
    // For example: a JWT Token or a CSRF token
    // const userToken = this.userService.getUserToken();
    // reqHeaders = reqHeaders.append('X-Auth-Token', openwattToken);

    // Force json content
    if (reqHeaders.has('Content-Type')) {
      reqHeaders = reqHeaders.set('Content-Type', 'application/json');
    }

    // withCredentials=false here to accept in response: 
    // access-control-allow-origin: * 
    // (not possible with cookies, withCredentials must then be false and real domain in place of '*')
    const newReq = req.clone({headers: reqHeaders, withCredentials: false});

    return next.handle(newReq).pipe(
      map((event: HttpEvent<any>) => {
       // Here, if token is returned in header, it is possible to log the user (only if auth token exists in response headers for a post request)
       //if (event instanceof HttpResponse) {
          //if (newReq.method === 'POST' && event.headers.has('X-Auth-Token') && !this.userService.isLogged())          {
            //this.userService.logUser(event.headers.get('X-Auth-Token')//);
          //}
        //}
        return event; // mandatory for processing json datas !
      }),
      timeout(3000),
      catchError((err: any) => {
        console.log('API call error is catched...');
        let errorMsg: string = '';

        if (err.error instanceof Error) {
          // Client side errors
          errorMsg = err.error.message;
          console.log(errorMsg);
        } else if (err instanceof HttpErrorResponse) {
          // Server side errors
          console.warn('HttpErrorResponse: code-> ' + err.status.toString() + ', body-> ' + JSON.stringify(err.error));
    
        // Generic errors handlers for APIs
        // applicative 'error_code' and 'detail' in returned json body
        // or http error if no applicative 'error_code'
        if (err.error.error_code) {
          const errorCode = err.error.error_code;
          errorMsg = 'Applicative error code (' + errorCode.toString() + ')';
            if (err.error.detail) {
              errorMsg += ': ' + err.error.detail;
            }
          } else if (err.status) {
          errorMsg = 'HTTP error code: ' + err.status.toString();
          } else {
            // Api not callable
            errorMsg='API call failure';
          }
         
          console.log(errorMsg);

          // Specific behaviour in case of token expiration: logout
          // http 401 for token expiration, http 403 for wrong credentials
          if (err.status === 401) {
            this.userService.resetUser();
            this.router.navigate(['/login']);
            }
       
      } else if (err instanceof TimeoutError) {
          errorMsg='Timeout Error on API call';
          console.log(errorMsg);
    } else {
          errorMsg='Unknown API call error type';
          console.log(errorMsg);  
        }
        // In all cases, return error message to components
        return throwError(errorMsg);
      }))
  }
}