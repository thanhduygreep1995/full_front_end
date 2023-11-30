import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWish } from '../interfaces/iwish';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WishService {

   items: IWish[] = [];
   private cartSubject = new BehaviorSubject<IWish[]>([]);
   constructor(private h: HttpClient) { 
    const saveWish = localStorage.getItem('wish');
    if (saveWish) {
      this.items = JSON.parse(saveWish);
      console.log('this hook work');
      this.cartSubject.next(this.items);
   }
  }
  addToWish(sp: IProduct) {
    console.log('add to wishlist')
    const index = this.items.findIndex(item => item.id == sp.id);
    if (index >= 0) {
      const item = this.items[index];
    //   item.soluong++;
    //   item.tongTien = item.price * item.soluong;

    }
    else {
      const item: IWish = {
        id: sp.id,
        hinh: sp.hinh,
        // images: sp.thumbnail,
        thumbnail: sp.thumbnail,
        soluong: 1,
        solanxem: 0,
        hot: 1,
        mota: sp.mota,
        ngay: sp.ngay,
        idType: sp.idType,
        description: sp.description,
        discount: sp.discount,
        discountPrice: sp.discountPrice,
        model: sp.model,
        name: sp.name,
        price: sp.price,
        updateDate: sp.updateDate,
        categoryId: sp.categoryId,
        // thumbnail: '',
        Images: []
      }
      
      this.items.push(item)
     
    }
    this.saveWishToLocalStorage();
    
  }

  removeFromWish(sp: IProduct) {
    const index = this.items.findIndex(item => item.id === sp.id);
    if (index > -1) {
      this.items.splice(index, 1);
      // this.cartSubject.next(this.cartItems);
          this.saveWishToLocalStorage();
    }
  }
  private saveWishToLocalStorage() {
    localStorage.setItem('wish', JSON.stringify(this.items));
  }



  clearWish() {
    this.items = [];
    this.saveWishToLocalStorage();
    return this.items
  }
  getWishItems(): Observable<IWish[]> {
    return this.cartSubject.asObservable();
  }
  
  getItems() { return this.items };
  count(){
    return this.items.length;
  }
}

