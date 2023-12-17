import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../interfaces/iproduct';
import { Itypeprd } from '../interfaces/itypeprd';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080/api/v0/products';
  private category$ = new BehaviorSubject<any>({});
  categoryAsOsb = this.category$.asObservable();
  postDataToServer: any;

  constructor(private h: HttpClient) {  }
  getTakeProduct(idSP:Number=0){
    // var url = `http://localhost:3000/sanpham?id=${idSP}`;
    var url = `http://localhost:8080/api/v0/products`;
    return this.h.get<IProduct[]>(url);

}
getNewProduct(){
  // var url='http://localhost:3000/sanpham?idLoai=1&_sort=ngay&order=desc&_limit=5';
  var url= `http://localhost:8080/api/v0/products`;
  return this.h.get<IProduct[]>( url );
}
getTypeProduct(){
  var url="http://localhost:8080/api/v0/categories/active"
  return this.h.get<any[]>(url);
}
getSanPhamTheoLoai(idType: number = 0) {
  var url = `http://localhost:8080/api/v0/products/category/${idType}`;
  return this.h.get<any[]>(url, { observe: 'response' });
}
getTenLoaiSanPham(idType:Number =0){
  var url = `http://localhost:8080/api/v0/categories/${idType}`;
  return this.h.get<any[]>(url);
}

getBrandProduct(){
  var url="http://localhost:8080/api/v0/brands"
  return this.h.get<Itypeprd[]>(url);
}
getBrand(idBrand:Number=0){
  var url = `http://localhost:8080/api/v0/brand/${idBrand}`;
  return this.h.get<Itypeprd[]>(url);
}
getNameBrand(idBrand: number = 0) {
  var url = `http://localhost:8080/api/v0/products/brand/${idBrand}`;
  return this.h.get<any>(url, { observe: 'response' });
}


getFeedBackProduct(id: number){
  const url = `http://localhost:8080/api/v0/feedbacks/list/${id}`;
  return this.h.get(url);
}
pushChangeCategory(data:any) {
  this.category$.next(data)
}


}



