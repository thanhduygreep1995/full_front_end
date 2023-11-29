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
    return this.http.put(url, null, { responseType: 'text' });
  }
  createOrder(orderDTO: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v0/orders/create', orderDTO);
  }
  createOrderDetail(orderDetailDTO: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v0/order-details/create', orderDetailDTO);
  }
  setVoucherCode(code: string, storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
    window[storageType].setItem('codeVoucher', code);
  }
  getVoucherCode(storageType: 'localStorage' | 'sessionStorage' = 'localStorage'): string | null {
    return window[storageType].getItem('codeVoucher');
  }
   setOrderData(data: any) {
    localStorage.setItem('orderData', JSON.stringify(data));
  }
  getOrderData(): any {
    const data = localStorage.getItem('orderData');
    return data ? JSON.parse(data) : null;
  } 
  clearOrderData(): void {
    localStorage.removeItem('orderData');
  }
}
