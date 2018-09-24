import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ListComponent as ListComponentCustomer } from './modules/customer/list/list.component';

import { AuthGuard } from './guards';
import { CustomerModule } from './modules/customer/customer.module';


const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'customer/list', component: ListComponentCustomer, canActivate: [AuthGuard] },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [    
      RouterModule.forRoot(appRoutes)
    ],
    exports: [
      CustomerModule,
      RouterModule, CustomerModule
    ]
  })
  export class AppRoutingModule { }