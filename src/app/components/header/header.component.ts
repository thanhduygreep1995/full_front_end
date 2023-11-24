import { Component, Input } from '@angular/core';

import { WishService } from 'src/app/components/services/wish.service';
import { CartService } from 'src/app/components/services/cart.service';
import { ProductService } from '../services/products.service';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  count: any; 
  cartItems: any;
  constructor( private wish: WishService, private cart:CartService, private searchService: SearchService,private router: Router){
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

  searchTerm: string = '';



  search() {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/listproduct']); 
  }

  
  
}
