import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/components/services/cart.service';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit  {
  private item: any[] = [];
  constructor(private cart: CartService) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.item = JSON.parse(savedCart);
   }
  }

  items = this.cart.getItems();
  ngOnInit() {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }

  }
  tongtien() {
    let tt: number = 0;
    this.items.forEach(item => tt = tt + Number(item.tongTien));
    return tt;
  }
  giamSoLuong(item1: any) {
    const item = this.items.find(item => item.id == item1.id);
    if (item != undefined && item.soluong > 0) {
      item.soluong--;
      item.tongTien -= item.price;
      this.saveToLocalStorage();
    }
    if(item?.soluong==0){
      this.removeFromCart(item1)
      this.saveToLocalStorage();
    }

  }

  tangSoLuong(item1: any) {
    const item = this.items.find(item => item.id == item1.id);
    if (item != undefined) {
      item.soluong++;
      item.tongTien = item.soluong * item.price;
      this.saveToLocalStorage();
    }
  }
  tongsoluong(item1: any) {
    let tsl: number = 0;
    this.items.forEach(item => {
      
      if (item.id == item1.id) {
        
        tsl += item.soluong
        this.saveToLocalStorage();
      }
      
    })
    
    return tsl;
    // this.saveCartToLocalStorage();
  }
  checkout() {
    // Thực hiện logic thanh toán ở đây
    // ...
    
    // Sau khi thanh toán, xóa giỏ hàng
    this.cart.clearCart();
  }
  removeFromCart(sp: IProduct) {
    this.cart.removeFromCart(sp);

  }


  private saveToLocalStorage() {
    // Lưu giá trị items vào localStorage
    localStorage.setItem('items', JSON.stringify(this.items));
  }
}


