import { Component } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { Itypeprd } from 'src/app/components/interfaces/itypeprd';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ProductService } from 'src/app/components/services/products.service';

@Component({
  selector: 'app-type-product',
  templateUrl: './type-product.component.html',
  styleUrls: ['./type-product.component.css']
})
export class TypeProductComponent {
  data: any[]=[];
  products: any;

  constructor(private d:DataService, private pS:ProductService) { }
  listTypePro:Itypeprd[] = [];
  ngOnInit(): void {
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
  }
}

