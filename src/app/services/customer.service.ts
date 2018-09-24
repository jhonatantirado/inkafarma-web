import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { environment } from '../../environments/environment';
import { Customer } from '../models/customer';
import { ResponseAllCustomersDto } from '../models/dto/responseAllCustomersDto';
import { ResponseApi } from '../models/responseApi';

@Injectable()
export class CustomerService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Customer[]>(`${environment.apiUrl}/Customers/customer`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/Customers/customer/` + id);
    }

    getCustomerByNumDoc(numDoc : string) {
        return this.http.get<Customer>(`${environment.apiUrl}/Customers/findByDocumentNumber?documentNumber=` + numDoc);
    }

    getAllCustomersByLimit(offset : number, limit : number) {
        return this.http.get<ResponseAllCustomersDto>(`${environment.apiUrl}/Customers/customer?offset=` + offset+'&limit='+limit);        
    }

    addCustomer(customer: Customer) {
        return this.http.post<ResponseApi>(`${environment.apiUrl}/Customers/customer`, customer);
    }

    updateCustomer(id : number, customer: Customer) {
        return this.http.put<ResponseApi>(`${environment.apiUrl}/Customers/customer/` + id, customer);
    }

    deleteCustomer(id: number) {
        return this.http.delete<ResponseApi>(`${environment.apiUrl}/Customers/customer/` + id);
    }
}