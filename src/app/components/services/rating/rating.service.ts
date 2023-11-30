import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8080/api/v0/rating-products';
  constructor(private http: HttpClient) {}
  getMyRating(productId: number, customerId: number): Observable<any> {
    const url = `${this.baseUrl}/my-rating?productId=${productId}&customerId=${customerId}`;
    return this.http.get<any>(url);
  }
}
