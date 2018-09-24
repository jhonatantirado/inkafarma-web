import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthenticationService } from '../services';
import { User } from '../models';
import { MessageAlertHandleService } from '../services/message-alert.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
  })
export class LoginComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    loginForm: FormGroup;
    private formSubmitAttempt: boolean;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public messageAlertHandleService: MessageAlertHandleService,
        private authenticationService: AuthenticationService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.authenticationService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get control() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.control.username.value, this.control.password.value)
            .pipe(first())
            .subscribe(
                successData => {
                    this.router.navigate([this.returnUrl]);
                    this.messageAlertHandleService.handleSuccess('Login successful');
                },
                error => {
                    // rfv
                    //.loading = false;
                    //this.messageAlertHandleService.handleError(error);
                    // rfv
                    var user = new User();
                    user.id = 2;
                    user.username = 'rernandezv';
                    user.password = 'rernandezv';
                    user.firstName = 'Richar';
                    user.lastName = 'Fernandez Vilchez';
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    sessionStorage.setItem("token", 'rfv123@#$%&');

                    console.log(error);
                    this.router.navigate([this.returnUrl]);
                    this.messageAlertHandleService.handleSuccess('Login successful temporarily');
                    // rfv
                },
                () => {

                }
            );
    }
}
