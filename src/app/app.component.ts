import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MessagingFirebaseService } from 'src/app/services/messaging-firebase.service';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    public isAuthenticated: boolean;
    message;
    
    constructor(
      public _containerRef: ViewContainerRef,
      private _router: Router,
      private messagingFirebaseService: MessagingFirebaseService
    ) {  
    }
  
    ngOnInit() {
        this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
            this.isAuthenticated = false;
            let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));        
            if (currentUser ) {
                this.isAuthenticated = true;
            }
        });
        this.messagingFirebase();
    }

    public messagingFirebase() : void{
        const userId = 'richar';
        this.messagingFirebaseService.requestPermission(userId)
        this.messagingFirebaseService.receiveMessage()
        this.message = this.messagingFirebaseService.currentMessage
    }
  }