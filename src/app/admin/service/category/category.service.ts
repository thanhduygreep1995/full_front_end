import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/v0/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createCategory(category: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post(url, category, { responseType: 'text' });
  }

  updateCategory(id: number, category: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, category, { responseType: 'text' });
  }

  deleteCategory(id: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  getActiveCategories() {
    return this.http.get(this.baseUrl + '/active');
  }

  getCategoryById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
