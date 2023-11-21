import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v0/products';

  constructor(private http: HttpClient) {}

  getAllProduct(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createProduct(product: any): Observable<any> {
    const url = `${this.baseUrl + '/create'}`;
    return this.http.post(url, product, { responseType: 'text' });
  }

  updateProduct(id: any, product: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, product, { responseType: 'text' });
  }

  deleteProduct(id: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  // getActiveProduct() {
  //   return this.http.get(this.baseUrl + '/active');
  // }

  getProductById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
