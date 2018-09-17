import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as HttpStatus from 'http-status-codes'

import { AuthenticationService } from '../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('error.interceptor.0');
        return next.handle(request).pipe(catchError(err => {
            if (err.status === HttpStatus.UNAUTHORIZED) {
                this.authenticationService.logout();
                location.reload(true);
            }
            console.log('error.interceptor.1');
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}