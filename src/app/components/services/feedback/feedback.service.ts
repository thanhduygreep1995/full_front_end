import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8080/api/v0/feedbacks';
  constructor(private http: HttpClient) {}
  getAllByCustomerId(customerId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/myfeedback/${customerId}`);
  }

  getFeedBackProduct(id: number){
    const url = `${this.baseUrl}/list/${id}`;
    return this.http.get(url);
  }

  createFeedBackProduct(feedback: any){
    const url = `${this.baseUrl}`;
    return this.http.post(url, feedback);
  }

}
