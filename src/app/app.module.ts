import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule  } from 'ngx-toastr';
import { BlockUIModule } from 'ng-block-ui';

import { AppComponent }  from './app.component';
import { AppRoutingModule }        from './app.routing';
import { HeaderComponent } from '../app/components/header/header.component';
import { AddDialogCustomerComponent} from './modules/customer/add/add.dialog.component';

import { AuthGuard } from './guards';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AuthenticationService, UserService, CustomerService } from './services';
import { MessageAlertHandleService } from './services/message-alert.service';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';

import {
    MatCardModule, MatFormFieldModule, 
    MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
    MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule,
    MatCheckboxModule, MatTableModule, MatToolbarModule, MAT_DIALOG_DATA, MatDialogRef
  } from '@angular/material';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        BlockUIModule.forRoot(
            {
              message: 'Please wait...'
            }
          ),

        MatCardModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    exports: [
        MatDatepickerModule
      ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        AddDialogCustomerComponent
    ],
    entryComponents: [
        AddDialogCustomerComponent
      ],
    providers: [
        AuthGuard,
        AuthenticationService,
        MessageAlertHandleService,
        UserService,
        CustomerService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: MatDialogRef, useValue: {} }, 
        { provide: MAT_DIALOG_DATA, useValue: {}}
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }