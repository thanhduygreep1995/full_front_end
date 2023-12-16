import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/v0/customers';

  constructor(private http: HttpClient) {}

  getCustomerById(id: any) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  updateProfile(id: any, category: any): Observable<any> {
    const url = `${this.baseUrl}/profile/${id}`;
    return this.http.put(url, category, { responseType: 'text' });
  }
  createCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, customerData, { responseType: 'text' });
  }
  changepassword(id:any,customerChangePassword: any): Observable<any> {
    const url = `${this.baseUrl}/change-password/${id}`;
    return this.http.put(url, customerChangePassword, { responseType: 'text' });
  }
  forgotPassword(customerForgotPassword: string) {
    const url = `${this.baseUrl}/forgotPassword`;
    return this.http.post(url,customerForgotPassword ,{ responseType: 'text' });
  }
  resetPassword(customerResetPassword: string) {
    const url = `${this.baseUrl}/resetPassword`;
    return this.http.post(url, customerResetPassword,{ responseType: 'text' });
  }
  removeCustomerResponseFromLocalStorage(): void{
    try {
        localStorage.removeItem('customer');
        console.log('removed customerResponse from localStorage');
    } catch (error) {
        console.log('error removing customerResponse from localStorage', error);
    }
}
}
