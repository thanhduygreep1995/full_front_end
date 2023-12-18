import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { customerResponse } from '../response/customer.response';
import { CustomerService } from '../services/customer.service';
import { TokenService } from '../services/token.service';
import { WishService } from '../services/wish.service';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';

import { SearchService } from '../services/search.service';
import { debounceTime, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProductService } from '../services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  count: any;
  wishItem: any[] = [];
  cartItems: any;
  customerResponse?: customerResponse | null

  searchControl = new FormControl();
  searchResults: string[] = [];
  constructor(
    private customerService: CustomerService,
    private tokenService: TokenService,
    private router: Router,
    private wish: WishService,
    private productService: ProductService,
    private cart: CartService,
    private searchService: SearchService,
    private languageService: LanguageService

  ) { }
  listProduct:any;

  showHin:any = false;
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
    this.productService.productOb$.subscribe(data=>{
      this.listProduct = data;
    })
    this.wish.getWishItems().subscribe((items) => {
      this.count = items;
      this.wishItem = items;
    });
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => this.searchService.search(term,this.listProduct))
    ).subscribe((results: string[]) => {
      this.showHin = true;
      console.log(this.showHin)
      this.searchResults = results;
      // console.log('Received results from mock service:', results);
    });
  }

  logout() {
    this.customerService.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();

  }
  selectedLanguage : string=this.languageService.getCurrentLanguage();
  changeLanguage(lang :string ) {
    this.languageService.changeLanguage(lang);
    location.reload();
  }
  

  



  searchTerm: string = '';
  search(searchTerm: any) {
    // console.log(searchTerm);
    this.showHin = false;
    this.searchService.setSearchTerm(searchTerm);
    // this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/listproduct']);
  }
  showSuggestions = false; // Trạng thái hiển thị gợi ý

  onSuggestionClick(result: string): void {
    // Xử lý khi click vào phần gợi ý
    console.log('Clicked on suggestion:', result);
    // Thực hiện các hành động khác nếu cần
    this.searchControl.setValue(result);
    this.showSuggestions = false; // Ẩn gợi ý khi click vào một phần tử
  }

  onInputClick() {
    this.showSuggestions = this.searchControl.value.length > 0;
  }
}






