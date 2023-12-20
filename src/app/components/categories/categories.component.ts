import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Itypeprd } from 'src/app/components/interfaces/itypeprd';
import { DataService } from 'src/app/components/services/data.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  selectedProducts: number[] = []
  constructor(private d:DataService, private router: Router, private route: ActivatedRoute) { }
  listTypePro:Itypeprd[] = [];
  ngOnInit(): void {
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
    let queryparam = window.location.pathname.split('/');
    let param = queryparam[queryparam.length-1];
    this.selectedProducts = param.split(',').map(function(item) {
      return parseInt(item, 10);
  });
  this.d.pushChangeCategory(this.selectedProducts);
  }
  toggleProductSelection(productId: number) {
    const index = this.selectedProducts.indexOf(productId);
    if (index === -1) {
      // Nếu sản phẩm chưa được chọn, thêm nó vào danh sách
      this.selectedProducts.push(productId);
    } else {
      // Nếu sản phẩm đã được chọn, loại bỏ nó khỏi danh sách
      this.selectedProducts.splice(index, 1);
    }
    
    if (this.selectedProducts.length > 0) {
      this.router.navigate(['/shop/category', this.selectedProducts.join(',')]);
    } else {
      // Nếu không có sản phẩm nào được chọn, xóa routerLink
      this.router.navigate(['/shop']);
    }
    this.d.pushChangeCategory(this.selectedProducts);
  }
}
