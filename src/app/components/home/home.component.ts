import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { WishService } from 'src/app/components/services/wish.service';
import { ProductService } from '../services/products.service';
import { SearchService } from '../services/search.service';
import { Pipe } from '@angular/core';
registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  listSP:any;
  products: any[] = [];
  filteredProducts: any[] = [];
  constructor( private h: HttpClient, private cart: CartService ,private wish: WishService, private productService: ProductService, private searchService:SearchService){
    this.h.get("http://localhost:8080/api/v0/products",
    {observe: 'response'}
).subscribe(
res => { 
console.log("ok=", res.ok);
console.log("body=", res.body);
console.log("res=", res);
console.log("Content-Type=", res.headers.get('Content-Type'));
this.listSP= res.body; 
})


  }
  addToCart(product:IProduct){
    this.cart.addToCart(product);
    alert("Đã thêm vào giỏ hàng")
  }
  addToWish(product:IProduct){
    this.wish.addToWish(product);
    alert("Like")
  }
  
  ngOnInit() {
    // Subscribe to the searchTerm changes
    this.searchService.currentSearchTerm.subscribe(searchTerm => {
      this.filterProducts(searchTerm);
    });

    // Fetch products from the API
    this.productService.getProducts().subscribe(
      data => {
        this.products = data;
        this.filteredProducts = this.products;
      },
      error => {
        console.error("Error fetching products:", error);
      }
    );
  }

  filterProducts(searchTerm: string) {
    // Implement your search logic here
    const searchTermLower = searchTerm.toLowerCase();
    this.filteredProducts = this.listSP.filter((product: { name: string; }) => {
      return product.name.toLowerCase().includes(searchTermLower);
    });
  }

  
}
export class Product{
  
}