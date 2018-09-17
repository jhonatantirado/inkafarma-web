import { Observable, throwError } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
  }

  getNombres() : String{
    if (localStorage.getItem('currentUser')) {
      var currentUser : User;
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser.firstName + ' ' + currentUser.lastName;
    }
    return "";
  }

}
