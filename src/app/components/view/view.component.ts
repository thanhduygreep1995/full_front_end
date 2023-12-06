import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '@angular/router';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import   localeFr from '@angular/common/locales/fr';
import { DatePipe, registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { RatingService } from '../services/rating.service';
import { FeedbackService } from '../services/feedback/feedback.service';
import { ProductService } from '../services/product/product.service';

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
  feedBacks: any;
  nameCustomer: any;
  comment: any;
  data: any[]=[];

  constructor( 
    private rate:RatingService,
    private d:DataService,  
    private route:ActivatedRoute, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private fB: FeedbackService,
    private pS: ProductService,
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
      hinh: [''],
      images: [''],
    });
   }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);    
    this.d.getTakeProduct(this.id).subscribe ( 
      res => { 
        this.infoProduct  = res[this.id - 1];
        this.getRatingListByProduct(this.id);

      });

    this.fB.getFeedBackProduct(this.id).subscribe((data) => {
        this.feedBacks = data;
      });
    
      
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
          customers: { id: 1 },
          products: { id: this.id }
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

    // this.infoProduct.images = imageUrl;

    this.infoProduct.thumbnail = imageUrl;
    console.log(this.infoProduct.hinh)

  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  
  createFeedback(){
    this.id = Number(this.route.snapshot.params['id']);    
    const feedback = {
      nameCustomer:this.infoProduct.nameCustomer,
      comment: this.infoProduct.comment,
      status: '',
      createDate: new Date(),
      updateDate: new Date(),
      customers: { id: 5 },
      products: { id: this.id }
  };

  this.fB.createFeedBackProduct(feedback).subscribe(
    (response) => {
      console.log('Successfully Create Feedback!',response);
    },
    (error) => {
      console.error('Failed to Create Feedback:', error);
      window.location.reload();
    }

  );
  }


}


