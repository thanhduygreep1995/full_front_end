import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8080/api/v0/payment';

  constructor(private http: HttpClient) {}

  createPayment(amount: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/create-payment?amount=${amount}`,{ responseType: 'text' });
  }
}
