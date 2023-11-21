import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private baseUrl = 'http://localhost:8080/api/v0/orderdetail';

  constructor(private http: HttpClient) {}

  getOrderDetail(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }



  getOrderDetailById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
  getOrderDetailByOrderId(id: any) {
    return this.http.get(this.baseUrl + '/getorderdetailbyorderid/' + id);
  }

}
