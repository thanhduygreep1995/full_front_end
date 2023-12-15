import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/components/services/cart.service';
import { RatingService } from 'src/app/components/services/rating.service';
import Swal from 'sweetalert2';
import { WishService } from '../services/wish.service';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent {
  starsInfo: { filled: boolean; half: boolean; noFill: boolean }[] = [];
  @Input() averageNumber: any;
  constructor(
    private d: DataService,
    private wish: WishService, 
    private cart: CartService,
    private rP: RatingService
  ) {}
  listProduct: any[] = [];
  ngOnInit(): void {
    this.d.getNewProduct().subscribe((d) => {
      const availableProducts = d.filter((product: any) => product.status === 'AVAILABLE');
      availableProducts.sort((a: any, b: any) => {
        // Assuming your products have a 'createDate' field to sort by
        const dateA = new Date(a['createDate']).getTime();
        const dateB = new Date(b['createDate']).getTime();
        return dateB - dateA; // Sort in descending order (latest first)
      });

      this.listProduct = availableProducts.slice(0, 10);
      this.listProduct.forEach((d: any) => {
        const productId = d.id;
        this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
          d.total_rate = ratingData || 0;
          console.log(d.total_rate);
          this.getRatingListByProduct();
        });
      });
    });
  }
  addToCart(product:IProduct){
    this.cart.addToCart(product);
    Swal.fire({
      icon:'success',
      title: 'Added To Cart Successfully',
      showConfirmButton: false,
      timer: 1000
    })
  }
  addToWish(product:IProduct){
    this.wish.addToWish(product);
    Swal.fire({
      icon:'success',
      title: 'Add To Wishlist Successfully',
      showConfirmButton: false,
      timer: 1000
    })
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
    if (!this.listProduct) {
      console.error('products is undefined or null.');
      return;
    }
    this.listProduct.forEach((item: any) => {
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

  calculateStars(
    average: number
  ): { filled: boolean; half: boolean; noFill: boolean }[] {
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
  // discountPercentage(price: number, discountPrice: number) {
  //   const percentage = ((price - discountPrice) / price) * 100;
  //   const roundedPercentage = Math.round(Math.abs(percentage)); // Làm tròn số phần trăm gần nhất và chuyển thành số dương
  //   return roundedPercentage;
  // }
}
