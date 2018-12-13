import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MessagingFirebaseService } from 'src/app/services/messaging-firebase.service';
import { MessageAlertHandleService } from 'src/app/services/message-alert.service';
import { messageNotification } from './models/messageNotification';
import { ToastrService } from 'ngx-toastr';



@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    public isAuthenticated: boolean;
    public notification : messageNotification = new messageNotification();
    public bodyPrev : string;
    message;
    
    constructor(
      public _containerRef: ViewContainerRef,
      private _router: Router,
      private toastr: ToastrService ,
      public messageAlertHandleService: MessageAlertHandleService,
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
        this.initializeFireBase();
    }

    public initializeFireBase() : void{
        const userId = 'marvin';
        this.messagingFirebaseService.requestPermission(userId)
        this.messagingFirebaseService.receiveMessage()
        this.message = this.messagingFirebaseService.currentMessage
    }

    public mostrarMensaje(msje: any): void{
        const errorArray: any[] = JSON.parse(msje);
        if(errorArray != null){
            /*
            if(this.bodyPrev !== errorArray['notification'].body){
                //this.popupNotification(errorArray['notification'].body);
                this.notification.title = errorArray['notification'].title;
                this.notification.body = errorArray['notification'].body;
            }
            this.bodyPrev = errorArray['notification'].body;    
            */
            this.notification.title = errorArray['notification'].title;
            this.notification.body = errorArray['notification'].body;        
        }        
    }

    public popupNotification(msje : string) : void{
        this.messageAlertHandleService.handleWarning(msje );
    }
  }