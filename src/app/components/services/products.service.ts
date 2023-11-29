import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v0/products';

  constructor(private http: HttpClient) { }
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${productId}`);
  }
  private searchTermSource = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTermSource.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }

  updateProductStock(productDTO:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/stock-quantity`,productDTO,{ responseType: 'text' });
  }
  
}