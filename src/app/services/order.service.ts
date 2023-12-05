import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/v0'; // Thay đổi thành URL của API backend

  constructor(private http: HttpClient) {}

  createOrder(order: any) {
    return this.http.post(`${this.apiUrl}/orders/list`, order);
  }

  getOrders() {
    return this.http.get(`${this.apiUrl}/orders/list`);
  }
}