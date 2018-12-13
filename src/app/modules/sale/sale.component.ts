import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MessageAlertHandleService} from '../../services/message-alert.service';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { SaleSearch } from '../../models/sale.search';
import { Sale } from '../../models/sale';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  saleForm: FormGroup;
  submitted = false;
  documentoNumberSearch : string;
  productNameSearch : string;
  searchCustomerCompleted : boolean;
  searchProductCompleted : boolean;
  disabledCustomer : boolean;
  disabledProduct : boolean;
  customerSearch : Customer = new Customer();
  productSearch : Product = new Product();

  constructor(
      public formBuilder: FormBuilder,
      public messageAlertHandleService: MessageAlertHandleService,
      public customerService: CustomerService,
      public productService: ProductService
  ) {}


  ngOnInit() {
      this.reset();
      this.saleForm = this.formBuilder.group({
        documentoNumberSearch: ['', Validators.required],
        productNameSearch: ['', Validators.required]
      });
  }

  reset(){
    this.searchCustomerCompleted = false;
    this.searchProductCompleted = false;
    this.disabledCustomer = false;
    this.disabledProduct = false;
    this.documentoNumberSearch = '';
    this.productNameSearch = '';
  }

  isFieldInvalid(field: string) {
      return (
        (!this.saleForm.get(field).valid && this.saleForm.get(field).touched )
      );
  }

  get control() { return this.saleForm.controls; }

  ngOnDestroy(): void {
    
  }

  onSubmitSearchCustomer() {
    if(!this.validSearchCustomer()){
      return;
    }
    this.blockUI.start(); 
    this.customerService.getCustomerByNumDoc(this.documentoNumberSearch).subscribe(
        successData => {
            if(successData != null){
              this.customerSearch = successData;
              this.searchCustomerCompleted = true;
              this.messageAlertHandleService.handleSuccess("Customer found");
            }else{
              this.customerSearch = new Customer();
              this.messageAlertHandleService.handleWarning("Customer not found");
            }
            this.blockUI.stop();
        },
        error => {
          this.searchCustomerCompleted = false;
          this.blockUI.stop();
        },
        () => {}
    );
  }

  public validSearchCustomer() : boolean{
   
    if(this.documentoNumberSearch == null ){
        return false;
    }
    if(this.documentoNumberSearch.length === 0 ){
      return false;
    }
    return true;
  }

  public onSubmitSearchProduct() : void{
    if(!this.validSearchProduct()){
      return;
    }
    this.blockUI.start(); 
    this.productService.getProductByName(this.productNameSearch).subscribe(
        successData => {
            if(successData != null){
              this.productSearch = successData;
              this.searchProductCompleted = true;
              this.messageAlertHandleService.handleSuccess("Product found");
            }else{
              this.productSearch = new Product();
              this.messageAlertHandleService.handleWarning("Product not found");
            }
            this.blockUI.stop();
        },
        error => {
          this.searchProductCompleted = false;
          this.blockUI.stop();
        },
        () => {}
    );
  }

  public validSearchProduct() : boolean{
   
    if(this.productNameSearch == null ){
        return false;
    }
    if(this.productNameSearch.length === 0 ){
      return false;
    }
    return true;
  }

  public obtenerDescripcionProduct(){
    if(this.productSearch != null && this.productSearch.id > 0){
        return this.productSearch.currencyISOCode + ' ' + this.productSearch.price + ', stock: ' + this.productSearch.stock ;
    }
    return "";
  }
}


