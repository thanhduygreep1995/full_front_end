import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api/v0/roles';

  constructor(private http: HttpClient) {}

  getRole(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }



  getRoleById(id: any) {
    return this.http.get(this.baseUrl + '/' + id);
  }
}
