import {MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent} from '@angular/material';
import {Component, Inject, OnInit } from '@angular/core';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {CustomerService} from '../../../services/customer.service';
import {FormControl, Validators, FormGroup ,FormBuilder } from '@angular/forms';
import {Customer} from '../../../models/customer';
import {RequestCustomerDto} from '../../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../../services/message-alert.service';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes'

@Component({
  selector: 'app-edit.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogCustomerComponent {
  @BlockUI() blockUI: NgBlockUI;
  editForm: FormGroup;
  requestCustomer: RequestCustomerDto;
  submitted = false;
  dateCustomer = new Date();

  constructor(public dialogRef: MatDialogRef<EditDialogCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Customer,
              private formBuilder: FormBuilder,
              public _messageAlertHandleService:MessageAlertHandleService ,
              public _customerService: CustomerService) { }

  ngOnInit() {
        this.editForm = this.formBuilder.group({
              firstName: ['', Validators.required],
              lastName: ['', Validators.required],
              documentNumber: ['', Validators.required],
              cellphone: ['', Validators.required],
              email: ['', Validators.required]
        });
        this.loadDataEdit();
  }

  get control() { return this.editForm.controls; }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  loadDataEdit(){
      this.control.firstName.setValue(this.data.firstName);
      this.control.lastName.setValue(this.data.lastName);
      this.control.documentNumber.setValue(this.data.documentNumber);
      this.control.cellphone.setValue(this.data.cellphone);
      this.control.email.setValue(this.data.email);      
  }

  preparateDataSubmit(){
    this.requestCustomer = new RequestCustomerDto()
          .setFirstName(this.control.firstName.value)
          .setLastName(this.control.lastName.value)
          .setDocumentNumber(this.control.documentNumber.value)
          .setCellphone(this.control.cellphone.value)
          .setEmail(this.control.email.value)
          .setIsActive(this.data.isActive)
      ;
  }

  public onSubmit(): void {
        this.blockUI.start();
        this.preparateDataSubmit();  

        this._customerService.updateCustomer(this.data.id, this.requestCustomer).subscribe(
            successData => {              
                this.blockUI.stop();
                
                if(successData.response.httpStatus == HttpStatus.OK.toString()){
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
}
