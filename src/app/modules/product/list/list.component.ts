import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatProgressSpinnerModule, MatTableDataSource, MatDialog, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {Product} from '../../../models/product';
import {Observable, of as observableOf, BehaviorSubject, merge, empty} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AddDialogProductComponent} from '.././add/add.dialog.component';
//import {EditDialogCustomerComponent} from '.././edit/edit.dialog.component';
//import {DeleteDialogCustomerComponent} from '.././delete/delete.dialog.component';
//import {ActivateDialogComponent} from '.././activate/activate.dialog.component';
import { MessageAlertHandleService } from '../../../services/message-alert.service';
import { ProductService} from '../../../services/product.service';
import { ResponseAllProductDto } from '../../../models/dto/responseAllProductDto';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponentProduct implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  displayedColumns = ['id', 'name', 'price', 'currency', 'stock', 'categoryId', 'status', 'actions'];  
  index: number;
  id: number;
  productDatabase: ProductDataBase | null;
  dataSource: MatTableDataSource<Product>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public messageAlertHandleService: MessageAlertHandleService,
              public productService: ProductService
            ) {
              }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
      
      this.productDatabase = new ProductDataBase(this.httpClient, this.productService, this.messageAlertHandleService);

      // If the user changes the sort order, reset back to the first page.
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      // Data
      this.changingData();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    changingData(){
          merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.productDatabase!.getProductList(
                this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
            }),
            map(data => {
              this.isLoadingResults = false;
              this.isRateLimitReached = false;
              this.resultsLength = data.totalRecords;

              return data.content;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              return observableOf([]);
            })
          //).subscribe(data => this.data = data);
         ).subscribe(data => this.dataSource = new MatTableDataSource(data) );
     }
  
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }
    
    addNew(product: Product) {
      
        const dialogRef = this.dialog.open(AddDialogProductComponent, {
          data: {product: product }
        });  
        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            //this.changingData();    //rfv
          }
        });
        
    }

    startEdit(i: number, product : Product) {
      /*
        this.id = customer.id;
        this.index = i;
        const dialogRef = this.dialog.open(EditDialogCustomerComponent, {
          data: {id: customer.id, 
                firstName: customer.firstName, 
                lastName: customer.lastName, 
                documentNumber: customer.documentNumber, 
                cellphone: customer.cellphone, 
                email: customer.email,
                isActive: customer.isActive}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            //this.changingData();    //rfv
          }
        });
        */
    }

    deleteItem(i: number, product : Product) {
      /*
        this.id = customer.id;
        this.index = i;
        const dialogRef = this.dialog.open(DeleteDialogCustomerComponent, {
          data: {id: customer.id, 
                firstName: customer.firstName, 
                lastName: customer.lastName, 
                documentNumber: customer.documentNumber, 
                cellphone: customer.cellphone, 
                email: customer.email, 
                isActive: customer.isActive,                
                birthDate : customer.birthDate}
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {            
              //this.changingData();    //rfv        
          }
        });
      */
    }

    activateItem(i: number, product : Product) {
          
    }
    
    private refreshTable() {

    }

    getDescriptionIsActive(isActive : boolean) : string{
      return (isActive)?'Yes':'No';
    }
}

export class ProductDataBase {
  pageSize : number = 20;

  constructor(private http: HttpClient, 
              private productService: ProductService,
              private messageAlertHandleService: MessageAlertHandleService) {}
              

  getProductList(sort: string, order: string, pageIndex: number, pageSize : number): Observable<ResponseAllProductDto> {
      if(pageSize === undefined){
        pageSize = this.pageSize;
      }
      ////// rfv ////// -- quitar desde qui
      
          var dto = new ResponseAllProductDto();
          var product = new Product();
          var data2: Product[] = [];
          

          if(pageSize != 5){
            dto.totalPages = 1;
            for(var i=1; i<=6; i++){
              product = new Product();
              product.id = i;
              product.name = "Aspirina";
              product.price = 1.4;
              product.currency = "PEN";
              product.stock = i*2;
              product.status = 1;
              product.categoryId = 1;
              data2.push(product);
            }
            dto.totalRecords = 6;
          }
          if(pageSize == 5){
            dto.totalPages = 2;
            for(var i=1; i<=5; i++){
              product = new Product();
              product.id = i;
              product.name = "Aspirina";
              product.price = 1.4;
              product.currency = "PEN";
              product.stock = i*2;
              product.status = 1;
              product.categoryId = 1;
              data2.push(product);
            }
            dto.totalRecords = 5;
          }
          dto.currentPage = 1;
          dto.pageSize =  pageSize; 
          dto.content = data2;
          

          return observableOf(dto);
          
    //////  rfv  -- rfv quitar hasta aqui

     /* rfv   -- descomentar
      return this.productService.getAllProductsByLimit( (pageIndex + 1), pageSize)
          .pipe(map(
                successData => {
                  return successData;
                }
              ),
              catchError((err, caught) => {
                // do anything if you want - rfv
                return empty();
              })
          ); 
    rfv */            
  }

  
}
