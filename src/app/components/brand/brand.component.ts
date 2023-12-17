import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Itypeprd } from '../interfaces/itypeprd';
import { Ibrand } from '../interfaces/ibrand';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent {
  selectedProducts: number[] = []
  selectedBrand: number[] = []
  constructor(private d:DataService, private router: Router, private route: ActivatedRoute) { }
  listTypePro:Itypeprd[] = [];
  listBrandPro:Ibrand[]=[];

  ngOnInit(): void {
    this.d.getBrandProduct().subscribe( d => this.listBrandPro = d);
    let queryparam = window.location.pathname.split('/');
    let param = queryparam[queryparam.length-1];
    this.selectedProducts = param.split(',').map(function(item) {
      return parseInt(item, 10);
  });
  this.d.pushChangeCategory(this.selectedProducts);
  }


  toggleProductSelectionBr(BrandId: number) {
    const index = this.selectedBrand.indexOf(BrandId);

    if (index === -1) {
      // Nếu sản phẩm chưa được chọn, thêm nó vào danh sách
      this.selectedBrand.push(BrandId);
    } else {
      // Nếu sản phẩm đã được chọn, loại bỏ nó khỏi danh sách
      this.selectedBrand.splice(index, 1);
    }

    if (this.selectedBrand.length > 0) {
      // Nếu có ít nhất một sản phẩm được chọn, cập nhật routerLink với danh sách các sản phẩm
      this.router.navigate(['/shop/brand', this.selectedBrand.join(',')]);
    } else {
      // Nếu không có sản phẩm nào được chọn, xóa routerLink
      this.router.navigate(['/shop']);
    }
    this.d.pushChangeCategory(this.selectedProducts);
  }
}

