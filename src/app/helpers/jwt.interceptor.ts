import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('jwt.interceptor.0');
        
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = localStorage.getItem('token');
        if (currentUser && token) {
            const headers = new HttpHeaders({
                'Authorization': `${localStorage.getItem('token')}`,
                'Content-Type':  'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            request = request.clone({headers});

        }
        console.log('jwt.interceptor.1');
        return next.handle(request);
    }
}