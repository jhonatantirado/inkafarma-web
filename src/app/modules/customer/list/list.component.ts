import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatProgressSpinnerModule, MatTableDataSource, MatDialog, MatPaginator, MatSort, PageEvent} from '@angular/material';
import {Customer} from '../../../models/customer';
import {Observable, of as observableOf, BehaviorSubject, merge, empty} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {DataSource} from '@angular/cdk/collections';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AddDialogCustomerComponent} from '.././add/add.dialog.component';
import {EditDialogCustomerComponent} from '.././edit/edit.dialog.component';
import {DeleteDialogCustomerComponent} from '.././delete/delete.dialog.component';
//import {ActivateDialogComponent} from '.././activate/activate.dialog.component';
import { MessageAlertHandleService } from '../../../services/message-alert.service';
import { CustomerService} from '../../../services/customer.service';
import { ResponseAllCustomersDto } from '../../../models/dto/responseAllCustomersDto';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  displayedColumns = ['id', 'firstName', 'lastName', 'documentNumber', 'cellphone', 'email', 'isActive', 'actions'];  
  index: number;
  id: number;
  customerDatabase: CustomerDataBase | null;
  //data: Customer[] = [];
  dataSource: MatTableDataSource<Customer>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;
  

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public messageAlertHandleService: MessageAlertHandleService,
              public customerService: CustomerService
            ) {
              }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
      
      this.customerDatabase = new CustomerDataBase(this.httpClient, this.customerService, this.messageAlertHandleService);

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
              return this.customerDatabase!.getCustomersList(
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
    
    addNew(customer: Customer) {
        const dialogRef = this.dialog.open(AddDialogCustomerComponent, {
          data: {customer: customer }
        });  
        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            //this.changingData();    //rfv
          }
        });
    }

    startEdit(i: number, customer : Customer) {
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
    }

    deleteItem(i: number, customer : Customer) {
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
    }

    activateItem(i: number, customer : Customer) {
          
    }
    
    private refreshTable() {

    }

    getDescriptionIsActive(isActive : boolean) : string{
      return (isActive)?'Yes':'No';
    }
}

export class CustomerDataBase {
  pageSize : number = 20;

  constructor(private http: HttpClient, 
              private customerService: CustomerService,
              private messageAlertHandleService: MessageAlertHandleService) {}
              

  getCustomersList(sort: string, order: string, pageIndex: number, pageSize : number): Observable<ResponseAllCustomersDto> {
      if(pageSize === undefined){
        pageSize = this.pageSize;
      }
      ////// rfv ////// -- quitar desde qui
          var dto = new ResponseAllCustomersDto();
          var customer = new Customer();
          var data2: Customer[] = [];
          

          if(pageSize != 5){
            dto.totalPages = 1;
            for(var i=1; i<=6; i++){
              customer = new Customer();
              customer.id = i;
              customer.documentNumber = "47288664";
              customer.firstName = "Richar";
              customer.lastName = "Fernandez";
              customer.isActive = "1";
              customer.cellphone = "111111";
              data2.push(customer);
            }
            dto.totalRecords = 6;
          }
          if(pageSize == 5){
            dto.totalPages = 2;
            for(var i=1; i<=5; i++){
              customer = new Customer();
              customer.id = i;
              customer.documentNumber = "47288664";
              customer.firstName = "Richar";
              customer.lastName = "Fernandez";
              customer.isActive = "1";
              customer.cellphone = "111111";
              data2.push(customer);
            }
            dto.totalRecords = 5;
          }
          dto.currentPage = 1;
          dto.pageSize =  pageSize; 
          dto.content = data2;
          

          return observableOf(dto);
    //////  rfv  -- rfv quitar hasta aqui

     /* rfv   -- descomentar
      return this.customerService.getAllCustomersByLimit( (pageIndex + 1), pageSize)
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
