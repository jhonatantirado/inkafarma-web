import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort, PageEvent} from '@angular/material';
//import {Customer} from '../.././models/customer';
import {Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import {BlockUI, NgBlockUI } from 'ng-block-ui';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import 'rxjs/add/observable/merge';
//import 'rxjs/add/observable/fromEvent';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
//import {AddDialogComponent} from '.././add/add.dialog.component';
//import {EditDialogComponent} from '.././edit/edit.dialog.component';
//import {DeleteDialogComponent} from '.././delete/delete.dialog.component';
//import {ActivateDialogComponent} from '.././activate/activate.dialog.component';
import { MessageAlertHandleService } from '../../../services/message-alert.service';
//import {CustomerService} from '../../services/customer.service';


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
  pageEvent: PageEvent;
  

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public _messageAlertHandleService: MessageAlertHandleService
            //  public _CustomerService: CustomerService
            ) {
              }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    
  }

/*
  addNew(customer: Customer) {

  }

  startEdit(i: number, customer : Customer) {
      
  }

  deleteItem(i: number, customer : Customer) {
      
  }

  activateItem(i: number, customer : Customer) {
      
  }
*/

  private refreshTable() {

  }


}
