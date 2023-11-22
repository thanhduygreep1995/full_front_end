import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { WishService } from 'src/app/components/services/wish.service';
import { Router } from '@angular/router';
registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  listSP:any;
  
  constructor( private h: HttpClient, private cart: CartService ,private wish: WishService, private router: Router)
  {
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

  onChangeView(id: number): void {
    this.router.navigate(['/view.component', id]);
  }


  addToCart(product:IProduct){
    this.cart.addToCart(product);
    alert("Đã thêm vào giỏ hàng")
  }
  addToWish(product:IProduct){
    this.wish.addToWish(product);
    alert("Like")
  }
  
  ngOnInit():void{

  }
}
export class Product{
  
}