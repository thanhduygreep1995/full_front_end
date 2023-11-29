import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseRatingUrl = 'http://localhost:8080/api/v0/rating-products';


  constructor(private http: HttpClient) { }

  getAllRatingList(): Observable<any[]> {
    return this.http.get<any[]>(this.baseRatingUrl);
  }

  getRatingByProductId(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseRatingUrl + "/" + id);
  }
  
  getTotalByProductId(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseRatingUrl + "/total/"+ id);
  }

  sendDBRequest(rating: any): Observable<any> {
    return this.http.post(this.baseRatingUrl, rating, { responseType: 'text' });
  }
}
