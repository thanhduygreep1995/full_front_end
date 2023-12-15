import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { customerResponse } from '../response/customer.response';
import { CustomerService } from '../services/customer.service';
import { TokenService } from '../services/token.service';
import { WishService } from '../services/wish.service';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  count: any; 
  wishItem: any[] = [];
  cartItems: any;
  customerResponse?:customerResponse | null
  constructor(
    private customerService: CustomerService,
    private tokenService: TokenService,
    private router: Router,
    private wish: WishService, 
    private cart:CartService,
    private languageService: LanguageService
  ){}
  
  ngOnInit() {
    this.customerResponse = this.customerService.getCustomerResponseFromLocalStorage(); 
    this.cart.getCartItems().subscribe((items) => {
      this.cartItems = items;
      console.log(this.cartItems)
    });

      this.wish.getWishItems().subscribe((items) => {
        this.count = items;
        this.wishItem = items;
        console.log(this.count)
        console.log(this.cartItems)
      });
    this.languageService.setInitialAppLanguage();
  }
  logout(){
    this.customerService.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();
  }
  selectedLanguage : string=this.languageService.getCurrentLanguage();
  changeLanguage(lang :string ) {
    this.languageService.changeLanguage(lang);
    location.reload();
  }
  
}
  

