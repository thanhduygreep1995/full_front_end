import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/v0/orders';

  constructor(private http: HttpClient) {}

  getOrder(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  updateOrder(id: number, order: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, order, { responseType: 'text' });
  }

  getOrderById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
  updateOrderstatus(id: number, order: any): Observable<any> {
    const url = `${this.baseUrl}/status/${id}`;
    return this.http.put(url, order, { responseType: 'text' });
  }
}
