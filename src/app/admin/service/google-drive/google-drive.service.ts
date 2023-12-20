import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private baseUrl = 'http://localhost:8080/api/v0/images';


  constructor(private http: HttpClient) {
  }


  getAllImage(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  getImageById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}`);
  }

  createImage(files: File, productId: number, imageStatus: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imageUrl', files, files.name);
    formData.append('productId', productId.toString());
    formData.append('imageStatus', imageStatus);

    return this.http.post(`${this.baseUrl}/upload`, formData, { responseType: 'text' });
  }

  updateImage(files: File, imageStatus: string, id: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imageUrl', files, files.name);
    formData.append('imageStatus', imageStatus);
    return this.http.put(`${this.baseUrl}/update/${id}`, formData, { responseType: 'text' });
  }

  deleteImage(id: any): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
