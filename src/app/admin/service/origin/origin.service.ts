import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OriginService {
  private baseUrl = 'http://localhost:8080/api/v0/origins';

  constructor(private http: HttpClient) {}

  getAllOrigins(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  createOrigin(origin: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post(url, origin, { responseType: 'text' });
  }

  updateOrigin(id: number, origin: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, origin, { responseType: 'text' });
  }

  deleteOrigin(id: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  getOriginById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
