import { HttpClient } from '@angular/common/http';
import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = 'http://localhost:8080/api/v0/vouchers'; // Điều chỉnh URL dựa trên URL của Spring Boot API

  constructor(private http: HttpClient) {}

  getVoucherByCode(codeVoucher: string, customerId: number): Observable<any> {
    const url = `${this.baseUrl}/use`;
    return this.http.get(url, { params: { codeVoucher, customerId }});
  }
  useVoucherByCode(codeVoucher: string): Observable<any> {
    const url = `${this.baseUrl}/use/${codeVoucher}`;
    return this.http.put(url, { responseType: 'text' });
  }
  setVoucherCode(code: string, storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
    window[storageType].setItem('codeVoucher', code);
  }
  getVoucherCode(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): string | null {
    return window[storageType].getItem('codeVoucher');
  }
}
