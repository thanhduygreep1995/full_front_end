import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8080/api/v0/rating-products';
  constructor(private http: HttpClient) {}
  getAllByCustomerId(customerId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/myrating/${customerId}`);
  }
}
