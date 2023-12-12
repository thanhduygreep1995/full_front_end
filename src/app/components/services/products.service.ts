import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductUrl = 'http://localhost:8080/api/v0/products';

  private baseSpecUrl = 'http://localhost:8080/api/v0/specifications';

  private baseImageUrl = 'http://localhost:8080/api/v0/images';

  constructor(private http: HttpClient) { }
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseProductUrl);
  }
  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseProductUrl}/${productId}`);
  }
  private searchTermSource = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTermSource.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }

  updateProductStock(productDTO:any): Observable<any> {
    return this.http.put(`${this.baseProductUrl}/stock-quantity`,productDTO,{ responseType: 'text' });
  }
  getProductTop(): Observable<any> {
    return this.http.get(`${this.baseProductUrl + '/top'}`);
  }

  getSpecPro(id: number): Observable<any> {
    return this.http.get(`${this.baseSpecUrl}/products/${id}`);
  }

  getImagePro(imageId: number): Observable<any> {
    return this.http.get(`${this.baseImageUrl}/products/${imageId}`);
  }

}