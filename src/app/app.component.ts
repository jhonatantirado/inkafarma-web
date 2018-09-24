import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    public isAuthenticated: boolean;
    
    constructor(
      public _containerRef: ViewContainerRef,
      private _router: Router
    ) {  
      //this.toastr.setRootViewContainerRef(_containerRef);
    }
  
    ngOnInit() {
        this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
            this.isAuthenticated = false;
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));        
        if (currentUser ) {
            this.isAuthenticated = true;
        }
      });
    }
  }