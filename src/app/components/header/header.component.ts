import { Component, Input } from '@angular/core';

import { WishService } from 'src/app/components/services/wish.service';
import { CartService } from 'src/app/components/services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  count: any; 
  cartItems: any;
  constructor( private wish: WishService, private cart:CartService){
    //  this.count = this.wish.count();
  }
  ngOnInit() {
    this.cart.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log(this.cartItems)
    });

      this.wish.getWishItems().subscribe((items) => {
        this.count = items;
        console.log(this.count)
      });
  }
}
