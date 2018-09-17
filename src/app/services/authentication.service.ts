import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ResponseApi } from '../models/responseApi';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(private http: HttpClient,
                private router: Router) 
    { }

    login(username: string, password: string) {
        return this.http.post<ResponseApi>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password })
            .pipe(map(
                successData => {
                    if (successData && successData.response.content) {
                        localStorage.setItem('currentUser', JSON.stringify(successData.response.content));
                        localStorage.setItem("token", successData.response.message);
                        this.loggedIn.next(true);
                    }
                    return successData;
                }
            ));
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    getLoggedIn() : BehaviorSubject<boolean>{
        return this.loggedIn;
    }
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    get isLoggedInValue(): boolean {
        return this.loggedIn.value;
    }
}