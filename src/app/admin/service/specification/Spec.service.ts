import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecService {
  private baseUrl = 'http://localhost:8080/api/v0/specifications';

  constructor(private http: HttpClient) {}

  getAllSpec(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createSpec(spec: any): Observable<any> {
    const url = `${this.baseUrl + '/create'}`;
    return this.http.post(url, spec, { responseType: 'text' });
  }

  updateSpec(id: any, spec: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, spec, { responseType: 'text' });
  }

  deleteSpec(id: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  // getActiveProduct() {
  //   return this.http.get(this.baseUrl + '/active');
  // }

  getSpecById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
