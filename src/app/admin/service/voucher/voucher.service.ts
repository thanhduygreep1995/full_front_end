import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private baseUrl = 'http://localhost:8080/api/v0/vouchers';
  constructor(private http: HttpClient) {}

  getAllVouchers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  getVoucherById(id: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  createVoucher(VoucherDTO :any): Observable<any> {
    const url = `${this.baseUrl}/create-voucher`;
    return this.http.post(url,VoucherDTO, { responseType: 'text' });
  }
}
