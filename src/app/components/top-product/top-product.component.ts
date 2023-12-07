import { Component, Input } from '@angular/core';
import { ProductService } from 'src/app/components/services/products.service';
import { RatingService } from 'src/app/components/services/rating.service';
import { CartService } from '../services/cart.service';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-top-product',
  templateUrl: './top-product.component.html',
  styleUrls: ['./top-product.component.css']
})
export class TopProductComponent {
  data: any[]=[];
  products: any;
  rate: any;
  responsiveOptions: any[] | undefined;
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  productIds: any;
  rating: any = 0;
  @Input() averageNumber: any;
  getRateElement: number = 0;
  totalRate: any[] = [];


  constructor( private h: HttpClient, private pS:ProductService,private cart: CartService, private rP: RatingService) { }
  ngOnInit(): void {

    this.pS.getProductTop().subscribe((data) => {
      this.products = data.map((product: any) =>({...product}));

    this.products.forEach((product: any) => {
      const productId = product.id;
      this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
        product.total_rate = ratingData || 0;
        console.log(product.total_rate);
        this.getRatingListByProduct();
      });

    });
      console.log(data);

    });
    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 5,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 5,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 5,
          numScroll: 1

      },
      {
        breakpoint: '576px',
        numVisible: 5,
        numScroll: 1

      }
    ];

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

  getRatingListByProduct() {
    if (!this.products) {
      console.error('products is undefined or null.');
      return;
    }
    this.products.forEach((item: any) => {
      console.log('Product:', item); // Kiểm tra xem dữ liệu sản phẩm có đúng không

      if (item.total_rate != 0 && item.ratingProduct.length != 0) {
        const averageRating = item.total_rate / item.ratingProduct.length;
        const averageNumber = this.customRound(averageRating);
        const starsInfo = this.calculateStars(averageNumber);
  
        // Thêm đánh giá cho từng sản phẩm
        item.averageRating = averageRating;
        item.averageNumber = averageNumber;
        item.starsInfo = starsInfo;
      } else {
        // Không có đánh giá, bạn có thể thiết lập giá trị mặc định
        item.averageRating = 0;
        item.averageNumber = 0;
        item.starsInfo = this.calculateStars(0);
      }
  
      console.log('Product after rating:', item); // Kiểm tra xem dữ liệu đã được gán đúng không
    });
  }


  calculateStars(average: number): { filled: boolean, half: boolean, noFill: boolean }[] {
    let stars = [];
  
    for (let i = 1; i <= 5; i++) {
      let filled = i <= Math.floor(average);
      let half = !filled && i === Math.ceil(average);
      let noFill = !filled && !half;
      // const no = !filled && !half &&  i ===
      stars.push({ filled, half, noFill });
    }
    return stars;
  }

  addToCart(product:IProduct){
    this.cart.addToCart(product);
    alert("Đã thêm vào giỏ hàng")
  }
}

