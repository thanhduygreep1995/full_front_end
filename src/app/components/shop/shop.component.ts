import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from '@angular/animations';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
import { Itypeprd } from '../interfaces/itypeprd';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  listSP:any;
  constructor(private h:HttpClient,private route: ActivatedRoute, private cartService: CartService,private d:DataService,private router: Router){
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
  id: any




  
  listTypePro:Itypeprd[] = [];
  ngOnInit(): void{

    this.route.paramMap.subscribe(query=>{
      this.id =query.get('id');
    })
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
  }
  isGridView = true;
  showGridView() {
    this.isGridView = true;
  }

  showListView() {
    this.isGridView = false;
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  
  onTypeSelect() {
  
    
    // Use the selectedTypeId to construct the route or perform other navigation logic
    this.router.navigate(['/your-path']);
  }
}