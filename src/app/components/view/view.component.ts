import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '@angular/router';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import   localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  rating: any = 0;
  products: any;
  infoProduct: any;
  id: any;
  count: number = 0;
  @Input() averageNumber: any;
  getRateElement: number[] = [];
  totalRate: any[] = [];
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  loading: boolean = false;

  constructor( 
    private rate:RatingService,
    private d:DataService,  
    private route:ActivatedRoute, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    // private snackBar: MatSnackBar

  ) {
    this.infoProduct = this.formBuilder.group({
      id: [''],
      name: [''],
      stockQuantity: [''],
      price: [''],
      createDate: [''],
      updateDate: [''],
      description: [''],
      model: [''],
      discountPrice: [''],
      discount: [''],
      productStatus: [''],
      categoryId: [''],
      brandId: [''],
      OriginsId: [''],
    });
   }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);    
    this.d.getTakeProduct(this.id).subscribe ( 
      res => { 
        this.infoProduct  = res[this.id - 1];
      //  this.categoryId = this.takeProduct.idLoai;

        this.getRatingListByProduct(this.id);

      });
    
      // this.cdr.detectChanges();
      
  }

  onClick() {
    Swal.fire({
      title: 'Please Rate This Product',
      html: `
      <select id="rating" class="swal2-input w-48 ">
        <option value=1>1 Star &#9733;</option>
        <option value=2>2 Stars &#9733; &#9733;</option>
        <option value=3>3 Stars &#9733; &#9733; &#9733;</option>
        <option value=4>4 Stars &#9733; &#9733; &#9733; &#9733;</option>
        <option value=5>5 Stars &#9733; &#9733; &#9733; &#9733; &#9733;</option>
      </select>

      `,
      customClass: {
        container: 'custom-swalert',
        confirmButton: 'custom-swalert-button',
      },
      confirmButtonText: 'Rate',
      showCancelButton: true,
      
    }).then((result) => {
      if (result.isConfirmed) {
        // Lấy giá trị từ select khi người dùng xác nhận
        const selectedValue = (document.getElementById('rating') as HTMLSelectElement).value;
        console.log('User rated:', selectedValue);
        const ratingForm = {
          nameCustomer: 'John Doe',
          rating: selectedValue,
          createDate: new Date(),
          updateDate: new Date(),
          customer: { id: 1 },
          product: { id: this.id }
        };
        this.loading = true;
        this.rate.sendDBRequest(ratingForm).subscribe(
          (response) => {
            setTimeout(() => {
              this.loading = false;
              Swal.fire({
                icon:'success',
                title: 'Rate Successfully',
                showConfirmButton: false,
                timer: 1000
              })
            },1000)
            console.log('response: ', response);
            this.getRatingListByProduct(this.id);
          },
          (err) => {
            setTimeout(() => {
              this.loading = false;
              Swal.fire({
                icon:'error',
                title: 'Rate Failure',
                showConfirmButton: false,
                timer: 1000
              })
            },1000)
            console.log('error: ', err);
          }
        );
      }
    });
    
  }

  calculateAverage(): number{
    if (this.getRateElement.length === 0) {
      return 0; // Tránh chia cho 0
    }
  
    let sum = 0;

    for (const rating of this.getRateElement) {
      if (typeof rating === 'number') {
        sum += rating;
      }
    }
    console.log("Sum Type:", typeof sum);
    return sum / this.getRateElement.length;
  }

  customRound(value: number): number {
    const floorValue = Math.floor(value);
    const decimalPart = value - floorValue;

    if (decimalPart < 0.5) {
        return floorValue;
    } else {
        return floorValue + 0.5;
    }
  }

  getRatingListByProduct(id: number) {
    this.count = 0;
    this.rate.getRatingByProductId(id).subscribe(rating => {
      this.totalRate = rating;
      console.log('User rated:', this.totalRate);
      console.log('Product Id rated:', id);
      for (let i of this.totalRate){
        this.getRateElement.push(i.rating);
        console.log('rating: ', i.rating);  
        this.count++;
      }
      this.averageNumber = this.customRound(this.calculateAverage());
      this.starsInfo = this.calculateStars(this.averageNumber);
      
      console.log( "Average: " + this.averageNumber); 
      console.log('getRateElement: ', this.getRateElement);
      console.log("Test " + this.count);
      
    });
  }
  calculateStars(average: number): { filled: boolean, half: boolean, noFill: boolean }[] {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.floor(average);
      const half = !filled && i === Math.ceil(average);
      const noFill = !filled && !half;
      // const no = !filled && !half &&  i ===
      stars.push({ filled, half, noFill });
    }
  
    return stars;
  }
  
  image1: string = 'https://cdn.tgdd.vn/Products/Images/42/230529/iphone-13-pro-max-xanh-la-thumb-600x600.jpg';

  // Hàm để thay đổi hình ảnh khi người dùng chọn
  changeImage(imageUrl: string): void {
    this.infoProduct.images = imageUrl;
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  
}


      //   takeProduct:IProduct={
//    id: 0, tensp:"", giasp:0, 
//    solanxem:0, hinh:"", 
//    mota:"", hot:0, ngay:"", idLoai:0 ,   
//    model: "",  
//    name: "",
//    price: 0,
//    description: "",
//    discount: 0,
//    discountPrice:0,
//    updateDate: "",
//    categoryId: 0
//  }; 
//  idSP:number=1;  
//  idLoai:number=0;
//  tenLoai:string="";

  // this.d.getTakeProduct().subscribe((data: any) => {
  //   console.log(data);
  //   this.products = data;
  // });

      

     
    //  }//res
    //  addToCart() {
    //   this.cartService.addToCart(this.takeProduct);
    //   this.router.navigate(['/cart']);
// constructor( private d:DataService, private h: HttpClient, private cart: CartService) { 

// }
// listProduct:IProduct[] = [];
// ngOnInit(): void {
//   this.d.getNewProduct().subscribe( d => this.listProduct = d);
// }
// addToCart(product:IProduct){
//   this.cart.addToCart(product);
//   alert("Đã thêm vào giỏ hàng")
// }

//   takeProduct:IProduct={
//    id:, tensp:"", giasp:0, 
//    solanxem:0, hinh:"", 
//    mota:"", hot:0, ngay:"", idLoai:0 ,   
//    model: "",  
//    name: "",
//    price: 0,
//    description: "",
//    discount: 0,
//    discountPrice:0,
//    updateDate: "",
//    categoryId: 0
//  }; 
