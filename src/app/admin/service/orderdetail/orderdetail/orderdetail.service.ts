import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private baseUrl = 'http://localhost:8080/api/v0/order-detail';

  constructor(private http: HttpClient) {}

  getOrderDetail(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }


  getOrderDetailById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
  getOrderDetailByOrderId(id: any) {
    return this.http.get(this.baseUrl + '/getByOrder/' + id);
  }
  updateQuantityOrderDetail(id: number, order: any): Observable<any> {
    const url = `${this.baseUrl}/quantity/${id}`;
    return this.http.put(url, order, { responseType: 'text' });
  }
  deleteDetailOrder(id: any): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
