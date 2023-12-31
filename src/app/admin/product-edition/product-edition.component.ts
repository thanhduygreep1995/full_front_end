import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product/product.service';
import { OriginService } from '../service/origin/origin.service';
import { BrandService } from '../service/brand/brand.service';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../service/category/category.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ButtonService } from '../service/button/buttonservice';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
})


@Component({
  selector: 'app-product-edition',
  templateUrl: './product-edition.component.html',
  styleUrls: ['./product-edition.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300)
      ]),
      state('out', style({ opacity: 0 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class ProductEditionComponent implements OnInit {
  // product: Product = new Product();
  id: any;
  productForm: any;
  ButtonSave: boolean = true;
  ButtonDelete: boolean = true;
  ButtonUpdate: boolean = true;

  categories!: any[];
  Origin!: any[];
  brands!: any[];
  selectedBrandId!: any;
  selectedOriginId!: any;
  selectedCategoryId!: any;
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  products: any;

  constructor(
    private formBuilder: FormBuilder,
    private pS: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private oS: OriginService,
    private bS: BrandService,
    private cS: CategoryService,
    public buttonService: ButtonService
    ) 
  {
    this.productForm = this.formBuilder.group({
      selectedBrand: ['', Validators.required], // Tên control phải khớp với formControlName trong template
      selectedOrigin    : ['', Validators.required],
      selectedCategory: ['', Validators.required], // Tên control phải khớp với formControlName trong template
      id: ['', Validators.required],
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', [Validators.required, Validators.min(1)]],
      thumbnail:['',Validators.required],
      description: ['', Validators.required],
      discountPercentage: ['', Validators.required],
      // discountPrice: ['', Validators.required],
      status: [''],
      categoryId: this.formBuilder.group({
        id: ["", Validators.required],
      }),
      brandId: this.formBuilder.group({
        id: ["", Validators.required],
      }),
      originId: this.formBuilder.group({
        id: ["", Validators.required],
      })
    });

    this.productForm.valueChanges.subscribe(() => {
      const nameControl = this.productForm.controls['name'].invalid;
      const priceControl = this.productForm.controls['price'].invalid;
      const quantityControl = this.productForm.controls['stockQuantity'].invalid;
      const discountPercentageControl = this.productForm.controls['discountPercentage'].invalid;
      // const discountPriceControl = this.productForm.controls['discountPrice'].invalid;
      const descriptionControl = this.productForm.controls['description'].invalid;
      this.ButtonSave = nameControl || descriptionControl || priceControl || quantityControl ||  discountPercentageControl  ;
    });
    this.productForm.valueChanges.subscribe(() => {
      this.ButtonDelete = this.productForm.controls['id'].invalid;
    });
    this.productForm.valueChanges.subscribe(() => {
      const nameControl = this.productForm.controls['name'].invalid;
      const priceControl = this.productForm.controls['price'].invalid;
      const quantityControl = this.productForm.controls['stockQuantity'].invalid;
      const discountPercentageControl = this.productForm.controls['discountPercentage'].invalid;
      // const discountPriceControl = this.productForm.controls['discountPrice'].invalid;
      const descriptionControl = this.productForm.controls['description'].invalid;
      this.ButtonUpdate = nameControl || descriptionControl || priceControl || quantityControl ||  discountPercentageControl  ;
    });

  };
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.id = params['id'];
        this.pS.getProductById(this.id).subscribe(
          (response: any) => {
            console.log(response)
            this.productForm.patchValue(response);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
      }
    });

    this.defaultStatus();
    this.refreshTable();
  }

  refreshTable() {
    this.oS.getAllOrigins().subscribe((data) => {
      this.Origin = data;
    });

    this.bS.getAllBrands().subscribe((data) => {
      this.brands = data;
    });
    this.cS.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  defaultStatus() {
    this.selectedCategoryId = "0"
    this.selectedBrandId = "0"
    this.selectedOriginId= "0"
    // selected status Active
    this.productForm.patchValue({
      status: 'AVAILABLE', // hoặc 'INACTIVE'
    });
  }

  onBrandSelectionChange() {
    // Biến selectedBrandId sẽ giữ giá trị của tùy chọn được chọn
    console.log(this.selectedBrandId); // Hoặc làm bất kỳ xử lý nào bạn muốn ở đây
  }

  fnAddProduct() {
    const productinfo = {
      name: this.productForm.value.name,
      model: this.productForm.value.model,
      price: this.productForm.value.price,
      stockQuantity: this.productForm.value.stockQuantity,
      // thumbnail: this.productForm.value.thumbnail,
      description: this.productForm.value.description,
      discountPercentage: this.productForm.value.discountPercentage,
      discountPrice: Math.round(this.productForm.value.price - (this.productForm.value.price  * (this.productForm.value.discountPercentage / 100)) ),
      status: this.productForm.value.status,
      categoryId: {
        id: this.selectedCategoryId,
      },
      brandId: {
        id: this.selectedBrandId
      },
      originId: {
        id: this.selectedOriginId
      }
  }; 
  this.isSpinning = true;
  this.pS.getAllProduct().subscribe((data) => {
    console.log(data);
    this.products = data;
    for (let p of this.products) {
      if (this.productForm.value.name == p.name && this.productForm.value.model == p.model) {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Name and Model of product is existed already',
            showConfirmButton: false,
            timer: 7000
          })
        }, this.progressTimerOut);
        return;
      } 
    }
    this.pS.createProduct(productinfo).subscribe(
      (response) => {
        console.log('Successfully Create Product!');
        this.router.navigate(['/admin/product-table']);
        setTimeout(() => {
          this.isSpinning = false;
          console.log('Successfully Create Product!');
          this.productForm.reset();
          this.defaultStatus();
          Swal.fire({
            icon: 'success',
            title: 'Successfully Create Product!',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
      },
      (error) => {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Your work has not been saved',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
        console.error('Failed to Create Product:', error);
      }
    );
  }, (err) => {
    console.log(err);
  });

}
fnUpdateProduct() {
  const productinfo = {
    name: this.productForm.value.name,
    model: this.productForm.value.model,
    price: this.productForm.value.price,
    stockQuantity: this.productForm.value.stockQuantity,
    thumbnail: this.productForm.value.thumbnail,
    description: this.productForm.value.description,
    discountPercentage: this.productForm.value.discountPercentage,
    discountPrice: Math.round(this.productForm.value.price - (this.productForm.value.price  * (this.productForm.value.discountPercentage / 100)) ),
    status: this.productForm.value.status,
    categoryId: {
      id: this.selectedCategoryId,
    },
    brandId: {
      id: this.selectedBrandId
    },
    originId: {
      id: this.selectedOriginId
    }
  };
  this.isSpinning = true;
  this.pS.getAllProduct().subscribe((data) => {
    console.log(data);
    this.products = data;
    for (let p of this.products) { 
      if((this.productForm.value.name == p.name 
        && this.productForm.value.model == p.model)
        && (this.productForm.value.price != p.price 
        || this.productForm.value.stockQuantity != p.stockQuantity
        || this.productForm.value.description != p.description
        || this.productForm.value.discountPercentage != p.discountPercentage
        || this.productForm.value.discountPrice != p.discountPrice
        || this.productForm.value.status != p.status
        || this.selectedCategoryId != p.category.id
        || this.selectedBrandId != p.brand.id
        || this.selectedOriginId != p.origin.id)
        ) {
          break;
      } 
      if (this.productForm.value.name == p.name && this.productForm.value.model == p.model) {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Name and Model of product is existed already',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
        return;
      }
    }
    this.pS.updateProduct(this.id, productinfo).subscribe(
      (response) => {
        setTimeout(() => {
          this.isSpinning = false;
          console.log('Successfully updated product!');
          
          this.productForm.reset();
          this.defaultStatus();

          Swal.fire({
            icon: 'success',
            title: 'Successfully updated product!',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
        
        console.log('Successfully updated product!');
      },
      (error) => {
        console.error('Failed to update product:', error);
      }
    );

  });
    }
}
