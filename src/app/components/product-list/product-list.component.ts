import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { WishService } from 'src/app/components/services/wish.service';
import { ProductService } from '../services/products.service';
import { SearchService } from '../services/search.service';
import { RatingService } from '../services/rating.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() averageNumber: any;
  listSP: any;
  rate: any;
  data: any[]=[];
  products: any;
  productIds: any;
  rating: any = 0;
  searchTerm: any = '';
  totalRate: any[] = [];
  getRateElement: number = 0;
  filteredProducts: any[] = [];
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  responsiveOptions: any = [
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
  constructor(private h: HttpClient, 
    private cart: CartService, 
    private wish: WishService, 
    private rP: RatingService,
    private productService: ProductService, 
    private searchService: SearchService) {
  }
  addToCart(product: IProduct) {
    this.cart.addToCart(product);
    alert("Đã thêm vào giỏ hàng")
  }
  addToWish(product: IProduct) {
    this.wish.addToWish(product);
    alert("Like")
  }
  ngOnInit(): void {
    // Subscribe to the searchTerm changes
    this.searchService.currentSearchTerm.subscribe(data => {
      console.log(data)
      // this.filterProducts(searchTerm);
      this.searchTerm = data;
    });
    // Fetch products from the API
    this.productService.getProducts().subscribe(data => {
        this.products = data;
        this.productService.pushListProduct(this.products.map((item:any)=>{return item.name}));
        this.products.forEach((product: any) => {
          const productId = product.id;
          this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
            product.total_rate = ratingData || 0;
            // console.log(product.total_rate);
            this.getRatingListByProduct();
          });
        });
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );

  }

  filterProducts(searchTerm: string) {
    // Implement your search logic here
    const searchTermLower = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((product: { name: string; }) => {
      return product.name.toLowerCase().includes(searchTermLower);
    });
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
      // console.log('Product:', item); // Kiểm tra xem dữ liệu sản phẩm có đúng không

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
  
      // console.log('Product after rating:', item); // Kiểm tra xem dữ liệu đã được gán đúng không
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
}
