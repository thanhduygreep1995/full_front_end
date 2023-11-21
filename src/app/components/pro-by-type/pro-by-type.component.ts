import { Component } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { Itypeprd } from 'src/app/components/interfaces/itypeprd';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-pro-by-type',
  templateUrl: './pro-by-type.component.html',
  styleUrls: ['./pro-by-type.component.css']
})

export class ProByTypeComponent {
  listSP:any;
  constructor(private h:HttpClient,private route: ActivatedRoute,  private d: DataService, private cartService: CartService){
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
  listProduct: IProduct[] = [];
  name: string = "";
  idType: number = 0;



// listTypePro: Itypeprd[] = [];


ngOnInit(): void {
  this.route.paramMap.subscribe(query=>{
    this.id =query.get('id');
  })
  this.idType = Number( this.route.snapshot.params['id'] );
  this.d.getTenLoaiSanPham(this.idType).subscribe ( 
    loai =>  { this.name= loai[0].name; }    
  );
  this.d.getSanPhamTheoLoai(this.idType).subscribe(
    (res: HttpResponse<IProduct[]>) => {
        if (res.body) {
            this.listProduct = res.body;
        }
    },
    error => {
        console.error(error);
    }
);
}
addToCart(product: any) {
  this.cartService.addToCart(product);
}
}




