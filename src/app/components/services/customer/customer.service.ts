import { HttpClient } from '@angular/common/http';
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
  // login(customerLogin: CustomerLoginDTO): Observable<any> {
  //   const url = `${this.baseUrl}/login`;
  //   return this.http.post(url, customerLogin, { responseType: 'text' });
  // }
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
}
