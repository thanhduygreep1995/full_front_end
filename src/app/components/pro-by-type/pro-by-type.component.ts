import { Component } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { Itypeprd } from 'src/app/components/interfaces/itypeprd';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/products.service';
import { WishService } from '../services/wish.service';
import Swal from 'sweetalert2';
import { RatingService } from '../services/rating.service';
@Component({
  selector: 'app-pro-by-type',
  templateUrl: './pro-by-type.component.html',
  styleUrls: ['./pro-by-type.component.css']
})

export class ProByTypeComponent {
  visibleItems: any[] = [];
  selectedIndex: number = 0;
  responsiveOptions: any[] | undefined;
  listSP:any;
  selectedProducts: any[] = [];
  listProduct: any[]=[];
  products: any[] = [];
  filteredProducts: any[] = [];
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  constructor(private h:HttpClient,private route: ActivatedRoute,  
    private d: DataService,      private cart: CartService ,
    private wish: WishService, 
    private productService: ProductService, 
    private rP: RatingService,
    private router:Router
    ){
     
  }
  id: any

  name: string = "";
  idType: number = 0;

  onChangeView(id: number): void {
    this.router.navigate(['/view.component', id]);
  }

// listTypePro: Itypeprd[] = [];
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

updateVisibleItems(): void {
  const numVisible = 5; // Adjust this based on your design
  const startIndex = Math.max(0, this.selectedIndex - Math.floor(numVisible / 2));
  this.visibleItems = this.listProduct.slice(startIndex, startIndex + numVisible);
}

goToItem(index: number): void {
  this.selectedIndex = index;
  this.updateVisibleItems();
}
preListCategoryId:any=[];
currListCategoryId:any=[];
ngOnInit(): void {
  
  console.log("listTypeProduct",this.selectedProducts);
  // Lấy id từ route parameter
  this.route.paramMap.subscribe(query => {
    this.id = query.get('id');
  });

  // Chuyển đổi id từ string sang number
  this.idType = Number(this.route.snapshot.params['id']);

  // Gọi API để lấy thông tin loại sản phẩm
  this.d.getTenLoaiSanPham(this.idType).subscribe(
    loai => {
      this.name = loai[0].name;
    }
  );

  // Gọi API để lấy danh sách sản phẩm theo loại
  // this.d.getSanPhamTheoLoai(this.idType).subscribe(
  //   (res: HttpResponse<IProduct[]>) => {
  //     if (res.body) {
  //       // Gán danh sách sản phẩm vào biến listProduct
  //       this.listProduct = res.body;
  //     }
  //   },
  //   error => {
  //     console.error(error);
  //   }
  // );

  this.d.categoryAsOsb.subscribe(data=>{
    this.listProduct = [];
    data.forEach((element: number | undefined) => {
      this.d.getSanPhamTheoLoai(element).subscribe(
        (res: HttpResponse<IProduct[]>) => {
          if (res.body) {
            // Gán danh sách sản phẩm vào biến listProduct
            this.listProduct = this.listProduct.concat(res.body);
            this.listProduct.forEach((product: any) => {
              const productId = product.id;
              this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
                product.total_rate = ratingData || 0;
                console.log('producttotal',product.total_rate);
                this.getRatingListByProduct();
              });
        
            });
          }
        },
        error => {
          console.error(error);
        }
      );
    });
  })


// Subscribe to the searchTerm changes


// Fetch products from the API
this.productService.getProducts().subscribe(
  data => {
    this.products = data;
    this.filteredProducts = this.products;
  },
  error => {
    console.error("Error fetching products:", error);
  }
);
this.responsiveOptions = [
  {
      breakpoint: '1200px',
      numVisible: 5,
      numScroll: 1
  },
  {
      breakpoint: '992px',
      numVisible: 5,
      numScroll: 1
  },
  {
      breakpoint: '768px',
      numVisible: 5,
      numScroll: 1
  },
  {
    breakpoint: '576px',
    numVisible: 5,
    numScroll: 1
  }
];
this.updateVisibleItems();

}
filterProducts(searchTerm: string) {
  // Implement your search logic here
  const searchTermLower = searchTerm.toLowerCase();

  if (this.listProduct && Array.isArray(this.listProduct)) {
    // Kiểm tra xem this.listProduct có tồn tại và là một mảng không
    this.filteredProducts = this.listProduct.filter((product: { name: string; }) => {
      return product.name.toLowerCase().includes(searchTermLower);
    });
  } else {
    console.error('listProduct is undefined or not an array in filterProducts.');
  }
}
// addToCart(product: any) {
//   this.cartService.addToCart(product);
// }
onSaveAllClick() {
  this.saveAllToSelectedProducts();
  console.log("listTypeProduct",this.selectedProducts);
}
// Lưu sản phẩm vào một mảng khác (ví dụ: danh sách sản phẩm đã được chọn)
saveAllToSelectedProducts() {
  // Kiểm tra xem listProduct có dữ liệu không
  if (this.listProduct.length < 0) {
    // Thêm tất cả sản phẩm từ listProduct vào mảng selectedProducts
    this.selectedProducts = [...this.selectedProducts, ...this.listProduct];
    
    console.log('Tất cả sản phẩm từ listProduct đã được thêm vào selectedProducts.');
  } else {
    console.log('Không có sản phẩm nào trong listProduct để thêm.');
  }
}
}

