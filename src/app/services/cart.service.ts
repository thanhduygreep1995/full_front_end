import { Injectable, OnInit } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';
import { Icart } from '../interfaces/icart';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  itemts: Icart[] = [];
  private cartSubject = new BehaviorSubject<Icart[]>([]);
   constructor(private h: HttpClient) { 
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.itemts = JSON.parse(savedCart);
      console.log('this hook work')
      this.cartSubject.next(this.itemts);
   }
  }
  addToCart(sp: IProduct) {
    console.log('ad to cart')
    const index = this.itemts.findIndex(item => item.id == sp.id);
    if (index >= 0) {
      const item = this.itemts[index];
      item.soluong++;
      item.tongTien = item.price * item.soluong;
    }
    else {
      const item: Icart = {
        id: sp.id,
        hinh: sp.hinh,
        images:sp.images,
        soluong: 1,
        solanxem: 0,
        hot: 1,
        mota: sp.mota,
        ngay: sp.ngay,
        idType: sp.idType,
        tongTien: sp.price,

        description: sp.description,
        discount: sp.discount,
        discountPrice: sp.discountPrice,
        model: sp.model,
        name: sp.name,
        price: sp.price ,
        updateDate: sp.updateDate,
        categoryId: sp.categoryId
      }
      this.itemts.push(item)
    }
    this.cartSubject.next(this.itemts);
    this.saveCartToLocalStorage();
  }

  removeFromCart(sp: IProduct) {
    const index = this.itemts.findIndex(item => item.id === sp.id);
    if (index > -1) {
      this.itemts.splice(index, 1);
      // this.cartSubject.next(this.cartItems);
          this.saveCartToLocalStorage();
    }
  }
  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.itemts));
  }

  // getCartFromLocalStorage() {
  //   const cartStr = localStorage.getItem('cart');
  //   if (cartStr) {
  //     this.itemts = JSON.parse(cartStr);
  //   }

  clearCart() {
    this.itemts = [];
    this.saveCartToLocalStorage();
    return this.itemts
  }
  // countPro(){
  //   const count= this.itemts.length;
  //   return count;
  // }
  getCartItems(): Observable<Icart[]> {
    return this.cartSubject.asObservable();
  }

  getItems() { return this.itemts };
  taoDonHang(hoten:string, diachi:string, dienthoai:string, email:string){
    const headers = new HttpHeaders()
   .set('content-type', 'application/json')
   .set('Access-Control-Allow-Origin', '*')
   .set('Access-Control-Allow-Credentials', 'true')
   .set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    return this.h.post("http://localhost:8080/api/v0/orders/list",
      {hoten:hoten, diachi:diachi, dienthoai:dienthoai, email:email },
      {'headers':headers}
    )
}
luuChiTietDonhang(idDH:number, item:Icart){
  const headers = new HttpHeaders()
   .set('content-type', 'application/json')
   .set('Access-Control-Allow-Origin', '*');
  return this.h.post<any>(
    "http://localhost:8080/api/v0/order_details/list",
    {"iddh":idDH,"idsp":item.id,"tensp":item.name,"giasp":item.price,"soluong":item.soluong},
    {'headers':headers}
  )
  } 
}




