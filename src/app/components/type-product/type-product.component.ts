import { Component } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { Itypeprd } from 'src/app/components/interfaces/itypeprd';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-type-product',
  templateUrl: './type-product.component.html',
  styleUrls: ['./type-product.component.css']
})
export class TypeProductComponent {

  constructor(private d:DataService) { }
  listTypePro:Itypeprd[] = [];
  ngOnInit(): void {
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
  }
}

