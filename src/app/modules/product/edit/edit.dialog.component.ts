import {MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent} from '@angular/material';
import {Component, Inject, OnInit } from '@angular/core';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {ProductService} from '../../../services/product.service';
import {FormControl, Validators, FormGroup ,FormBuilder } from '@angular/forms';
import {Product} from '../../../models/product';
import {Currency} from '../../../models/currency';
import {CategoryProduct} from '../../../models/categoryProduct';
import {RequestProductDto} from '../../../models/dto/requestProductDto';
import {RequestCustomerDto} from '../../../models/dto/requestCustomerDto';
import {MessageAlertHandleService} from '../../../services/message-alert.service';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes'

@Component({
  selector: 'app-edit.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.css']
})
export class EditDialogProductComponent {
  @BlockUI() blockUI: NgBlockUI;
  editForm: FormGroup;
  requestProduct: RequestProductDto;
  submitted = false;
  dateRegistration = new Date();
  dateExpiration = new Date();
  currencyList: Currency[] = [
    {value: 'PEN', viewValue: 'Soles'},
    {value: 'USD', viewValue: 'Dólares'},
    {value: 'EUR', viewValue: 'Euros'}
  ];
  categoryList: CategoryProduct[] = [
    {value: 1, viewValue: 'Analgésicos'},
    {value: 2, viewValue: 'Antiácidos y antiulcerosos'},
    {value: 3, viewValue: 'Antialérgicos'},
    {value: 4, viewValue: 'Antidiarreicos y laxantes'},
    {value: 5, viewValue: 'Antiinfecciosos'},
    {value: 6, viewValue: 'Antiinflamatorios'},
    {value: 7, viewValue: 'Antipiréticos'},
    {value: 8, viewValue: 'Antitusivos y mucolíticos'}
  ];

  constructor(public dialogRef: MatDialogRef<EditDialogProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Product,
              private formBuilder: FormBuilder,
              public _messageAlertHandleService:MessageAlertHandleService ,
              public _productService: ProductService) { }

  ngOnInit() {
        this.editForm = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            currency: ['', Validators.required],
            stock: ['', Validators.required],
            categoryId: ['', Validators.required],
            lotNumber: ['', Validators.required],
            sanitaryRegistrationNumber: ['', Validators.required],
            expirationDate: ['', Validators.required]  
       });
        this.loadDataEdit();
  }

  get control() { return this.editForm.controls; }

  onNoClick(): void {
    this.dialogRef.close('x');
  }

  loadDataEdit(){
      this.control.name.setValue(this.data.name);
      this.control.price.setValue(this.data.price);
      this.control.currency.setValue(this.data.currency);
      this.control.stock.setValue(this.data.stock);
      this.control.categoryId.setValue(this.data.categoryId);
      this.control.lotNumber.setValue(this.data.lotNumber);
      this.control.sanitaryRegistrationNumber.setValue(this.data.sanitaryRegistrationNumber);
      this.control.expirationDate.setValue(this.data.expirationDate);
  }

  preparateDataSubmit(){
    if(this.dateExpiration != null){          
      this.data.expirationDate = moment(this.dateExpiration).format('YYYY-MM-DD');
    }

    this.requestProduct = new RequestProductDto()
          .setName(this.control.name.value)
          .setPrice(this.control.price.value)
          .setCurrency(this.control.currency.value)
          .setStock(this.control.stock.value)
          .setCategoryId(this.control.categoryId.value)
          .setLotNumber(this.control.lotNumber.value)
          .setSanitaryRegistrationNumber(this.control.sanitaryRegistrationNumber.value)
          .setRegistrationDate(this.data.registrationDate)
          .setExpirationDate(this.data.expirationDate)
          .setStatus(this.data.status)
          .setStockStatus(this.data.stockStatus)
      ;
  }

  public onSubmit(): void {
        this.blockUI.start();
        this.preparateDataSubmit();  

        this._productService.updateProduct(this.data.id, this.requestProduct).subscribe(
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