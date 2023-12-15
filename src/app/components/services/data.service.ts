import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProduct } from '../interfaces/iproduct';
import { Itypeprd } from '../interfaces/itypeprd';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080/api/v0/products';

  constructor(private h: HttpClient) {  }
  getTakeProduct(idSP:Number=0){
    // var url = `http://localhost:3000/sanpham?id=${idSP}`;
    var url = `http://localhost:8080/api/v0/products`;
    return this.h.get<IProduct[]>(url);

}
getNewProduct(){
  // var url='http://localhost:3000/sanpham?idLoai=1&_sort=ngay&order=desc&_limit=5';
  var url= `http://localhost:8080/api/v0/products`;
  return this.h.get<any>( url );
}
getTypeProduct(){
  var url="http://localhost:8080/api/v0/categories"
  return this.h.get<Itypeprd[]>(url);
}
getSanPhamTheoLoai(idType: number = 0) {
  var url = `http://localhost:8080/api/v0/products/category/${idType}`;
  return this.h.get<any>(url, { observe: 'response' });
}
getTenLoaiSanPham(idType:Number=0){
  var url = `http://localhost:8080/api/v0/categories/${idType}`;
  return this.h.get<Itypeprd[]>(url);
}

getFeedBackProduct(id: number){
  const url = `http://localhost:8080/api/v0/feedbacks/list/${id}`;
  return this.h.get(url);
}
  getQRCode(product: any): Observable<Blob> {
    const params = new HttpParams().set('data', JSON.stringify(product));
    return this.h.get('http://localhost:8080/api/v0/products/generateQRCode', {
      responseType: 'blob', params: params
    });
  }
}



