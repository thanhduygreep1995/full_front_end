import { Component,Input, Output, EventEmitter } from '@angular/core';
import { WishService } from 'src/app/components/services/wish.service';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  private item1: any[] = [];
  constructor(private wish: WishService , private cartService: CartService) {
    const savedWish = localStorage.getItem('wish');
    if (savedWish) {
      this.item1 = JSON.parse(savedWish);
   }
   const count = this.wish.count();
   console.log(count);
  }

  items = this.wish.getItems();
   ngOnInit() {
    this.items = this.wish.getItems();

  }
  

  removeFromWish(sp: IProduct) {
    this.wish.removeFromWish(sp);
  }
  callCountFunction(): void {

  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
    Swal.fire({
      icon:'success',
      title: 'Added To Cart Successfully',
      showConfirmButton: false,
      timer: 1000
    })
  }

}




