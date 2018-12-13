import { Component, OnInit, OnDestroy, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { MatProgressSpinnerModule, MatTableDataSource, MatPaginator, MatSort, PageEvent} from '@angular/material';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MessageAlertHandleService} from '../../services/message-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, of as observableOf, BehaviorSubject, merge, empty} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { DataSource} from '@angular/cdk/collections';
import { HttpClient} from '@angular/common/http';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { Sale } from '../../models/sale';
import { SaleDetail } from '../../models/sale.detail';
import { Currency } from '../../models/currency';

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
  quantity : number;
  searchCustomerCompleted : boolean;
  searchProductCompleted : boolean;
  disabledCustomer : boolean;
  disabledProduct : boolean;
  customerSearch : Customer = new Customer();
  productSearch : Product = new Product();
  sale : Sale = new Sale();
  detailSale : SaleDetail;
  displayedColumns = ['product_id', 'productName', 'currency', 'price', 'quantity', 'actions'];
  saleDetailDatabase: SaleDetailDataBase | null;
  dataSource: MatTableDataSource<SaleDetail>;
  resultsLength = 0;
  currencyList: Currency[] = [
    {value: 604, viewValue: 'PEN'},
    {value: 840, viewValue: 'USD'},
    {value: 978, viewValue: 'EUR'}
  ];

  constructor(
      public httpClient: HttpClient,
      public formBuilder: FormBuilder,
      public messageAlertHandleService: MessageAlertHandleService,
      public customerService: CustomerService,
      public productService: ProductService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
      this.reset();
      this.saleForm = this.formBuilder.group({
        documentoNumberSearch: ['', Validators.required],
        productNameSearch: ['', Validators.required],
        quantity: ['', Validators.required]
      });
  }

  reset(){
    this.searchCustomerCompleted = false;
    this.searchProductCompleted = false;
    this.disabledCustomer = false;
    this.disabledProduct = false;
    this.documentoNumberSearch = '';
    this.productNameSearch = '';
    this.quantity = 0;
    this.dataSource = new MatTableDataSource();
    this.sort = new MatSort();
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
              this.quantity = 1;
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

  public onSubmitAddProduct() : void{
      if(! this.validateAddProduct()){
        return;
      }
      this.detailSale = new SaleDetail()
        .setId(0)
        .setPrice(this.productSearch.price)
        .setProductId(this.productSearch.id)
        .setProductName(this.productSearch.name)
        .setQuantity(this.quantity)
        .setCurrency(this.productSearch.currencyISOCode)
        .setSaleOrderId(0)
        .setStatus(1);
      this.sale.salesorderdetall.push(this.detailSale);
      this.updateDetailProducts();
      this.cleanAddProduct();
      console.log("Add product");
      console.log(this.sale);
  }

  public cleanAddProduct() : void{
    this.productNameSearch = "";
    this.quantity = 1;
    this.searchProductCompleted = false;
    this.productSearch = new Product();
  }

  public validateAddProduct() : boolean{
    if(this.quantity == null || this.quantity <= 0){
        this.messageAlertHandleService.handleError("Please, type a correct quantity");
        return false;
    }
    if(this.quantity > this.productSearch.stock){
        this.messageAlertHandleService.handleError("The quantity can not exceed the stock");
        return false;
    }
    return true;
  }

  updateDetailProducts() {      
    this.saleDetailDatabase = new SaleDetailDataBase(this.httpClient, this.sale.salesorderdetall, this.messageAlertHandleService);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.changingData();
    if(this.dataSource != undefined){
        if(this.paginator != undefined){
          this.dataSource.paginator = this.paginator;
        }      
        if(this.sort != undefined){
          this.dataSource.sort = this.sort;
        }
    }else{
        this.dataSource = new MatTableDataSource();
    }              
  }

  changingData(){
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {        
        return this.saleDetailDatabase!.getProductsList();
      }),
      map(data => {
        this.resultsLength = data.length;
        return data;
      }),
      catchError(() => {
        return observableOf([]);
      })
   ).subscribe(data => this.dataSource = new MatTableDataSource(data) );
}


}


  ///////////////////// sale detail /////////////////////
  export class SaleDetailDataBase {
    pageSize : number = 10;
  
    constructor(private http: HttpClient,
                private detail : SaleDetail[],
                private messageAlertHandleService: MessageAlertHandleService) {}
                
  
    getProductsList(): Observable<SaleDetail[]> {
        return observableOf(this.detail);
    }
  
    
  }
  