import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private baseUrl = 'http://localhost:8080/api/v0/brands';

  constructor(private http: HttpClient) {}

  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  createBrand(brand: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post(url, brand, { responseType: 'text' });
  }

  updateBrand(id: number, brand: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, brand, { responseType: 'text' });
  }

  deleteBrand(id: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  getBrandById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
