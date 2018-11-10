import {MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent} from '@angular/material';
import {Component, Inject, OnInit } from '@angular/core';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {CustomerService} from '../../../services/customer.service';
import {FormControl, Validators, FormGroup ,FormBuilder } from '@angular/forms';
import {Customer} from '../../../models/customer';
import {MessageAlertHandleService} from '../../../services/message-alert.service';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes'

@Component({
  selector: 'app-add.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.css']
})


export class AddDialogCustomerComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  createForm: FormGroup;
  submitted = false;
  dateCustomer = new Date();

  constructor(public dialogRef: MatDialogRef<AddDialogCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer,
              private formBuilder: FormBuilder,
              public _messageAlertHandleService:MessageAlertHandleService ,
              public _customerService: CustomerService) { }

  ngOnInit() {
        this.createForm = this.formBuilder.group({
              firstName: ['', Validators.required],
              lastName: ['', Validators.required],
              documentNumber: ['', Validators.required],
              cellphone: ['', Validators.required],
              email: ['', Validators.required],
              birthDate: ['', Validators.required]
        });
  }

  get control() { return this.createForm.controls; }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateCustomer = event.value;
  }

  preparateDataSubmit(){
      this.data.id = null;
      this.data.firstName = this.control.firstName.value;
      this.data.lastName = this.control.lastName.value;
      this.data.documentNumber = this.control.documentNumber.value;
      this.data.email = this.control.email.value;
      this.data.cellphone = this.control.cellphone.value;
      if(this.dateCustomer != null){          
        this.data.birthDate = moment(this.dateCustomer).format('YYYY-MM-DD');
      }
      this.data.isActive = "1";
  }

  public onSubmit(): void {
        this.submitted = true
        this.blockUI.start();        
        this.preparateDataSubmit();
        this._customerService.addCustomer(this.data).subscribe(

          successData => {              
              this.blockUI.stop();
              if(successData.response.httpStatus == HttpStatus.CREATED.toString()){
                this.updateNewCustomer(this.data.documentNumber);
                this._messageAlertHandleService.handleSuccess(successData.response.message);
                this.dialogRef.close(1);
              }else{
                this._messageAlertHandleService.handleError(successData.response.message);
              }
          },
          error => {
              this.blockUI.stop();
              this.dialogRef.close(1); // rfv - quitar
          },
          () => {}
      );
  }

  updateNewCustomer(document : string){
    this._customerService.getCustomerByNumDoc(document).subscribe(
        successData => {
            if(successData != null){
              this.data.id = successData.id;
            }
        },
        error => {},
        () => {}
    );
  }
}
