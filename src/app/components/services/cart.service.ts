import { Injectable, OnInit } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';
import { Icart } from '../interfaces/icart';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: Icart[] = [];
  private cartSubject = new BehaviorSubject<Icart[]>([]);
   constructor(private h: HttpClient) { 
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      console.log('this hook work')
      this.cartSubject.next(this.items);
   }
  }
  addToCart(sp: IProduct) {
    console.log('add to cart')
    const index = this.items.findIndex(item => item.id == sp.id);
    if (index >= 0) {
      const item = this.items[index];
      item.soluong++;
      item.tongTien = item.price * item.soluong;
    }
    else {
      const item: Icart = {
        id: sp.id,
        hinh: sp.hinh,
        thumbnail: sp.thumbnail,
        soluong: 1,
        solanxem: 0,
        hot: 1,
        mota: sp.mota,
        ngay: sp.ngay,
        idType: sp.idType,
        tongTien: sp.price,
        discount: sp.discount,
        discountPrice: sp.discountPrice,
        model: sp.model,
        name: sp.name,
        price: sp.price,
        updateDate: sp.updateDate,
        categoryId: sp.categoryId,
        description: sp.description,
        // thumbnail: '',
        Images: []
      }
      this.items.push(item)
    }
    this.cartSubject.next(this.items);
    this.saveCartToLocalStorage();
  }

  removeFromCart(sp: IProduct) {
    const index = this.items.findIndex(item => item.id === sp.id);
    if (index > -1) {
      this.items.splice(index, 1);
      // this.cartSubject.next(this.cartItems);
          this.saveCartToLocalStorage();
    }
  }
  
  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // getCartFromLocalStorage() {
  //   const cartStr = localStorage.getItem('cart');
  //   if (cartStr) {
  //     this.items = JSON.parse(cartStr);
  //   }

  tongtien() {
    let tt: number = 0;
    this.items.forEach(item => tt = tt + Number(item.tongTien));
    return tt;

  }
  xoaTatCaSanPhamKhoiGioHang() {
    // Xóa tất cả sản phẩm trong giỏ hàng (items) và lưu vào localStorage

    localStorage.removeItem('items');
    localStorage.removeItem('cart');
  }
  clearCart() {
    this.items = [];
  }
  // countPro(){
  //   const count= this.items.length;
  //   return count;
  // }
  getCartItems(): Observable<Icart[]> {
    return this.cartSubject.asObservable();
  }

  getItems() { return this.items };
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




