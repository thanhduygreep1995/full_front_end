import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private baseUrl = 'http://localhost:8080/api/v0/vouchers';

  constructor(private http: HttpClient) {}

  getAllByCustomerId(customerId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/myVoucher/${customerId}`);
  }

  addMyVoucher(addVoucher: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/addToMyVoucher`,addVoucher,{ responseType: 'text' });
  }
}
