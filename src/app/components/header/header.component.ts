import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { customerResponse } from '../response/customer.response';
import { CustomerService } from '../services/customer.service';
import { TokenService } from '../services/token.service';
import { WishService } from '../services/wish.service';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  count: any; 
  cartItems: any;
  customerResponse?:customerResponse | null
  constructor(
    private customerService: CustomerService,
    private tokenService: TokenService,
    private router: Router,
    private wish: WishService, 
    private cart:CartService,
    private searchService: SearchService
  ){}
  
  ngOnInit() {
    this.customerResponse = this.customerService.getCustomerResponseFromLocalStorage(); 
    this.cart.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log(this.cartItems)
    });

      this.wish.getWishItems().subscribe((items) => {
        this.count = items;
        console.log(this.count)
      });
  }
  logout(){
    this.customerService.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();
  }



  searchTerm: string = '';



  search() {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/listproduct']); 
  }

  

  
}
  

