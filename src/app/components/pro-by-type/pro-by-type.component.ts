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
  listProduct: any[]=[];
  products: any[] = [];
  filteredProducts: any[] = [];
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  constructor(private h:HttpClient,private route: ActivatedRoute,  
    private d: DataService,      private cart: CartService ,
    private wish: WishService, 
    private productService: ProductService, 

    private router:Router
    ){
    this.h.get("http://localhost:8080/api/v0/home",
    {observe: 'response'}).subscribe(res => { 
      console.log("ok=", res.ok);
      console.log("body=", res.body);
      console.log("res=", res);
      console.log("Content-Type=", res.headers.get('Content-Type'));
      this.listSP= res.body;
    })
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
    console.error('listProduct is undefined or null.');
    return;
  }

  this.listProduct.forEach((item: any) => {
    console.log('Product:', item); // Kiểm tra xem dữ liệu sản phẩm có đúng không

    if (item.rate != 0 && item.count != 0) {
      const rating = item.rate / item.count;
      const averageNumber = this.customRound(rating);
      const starsInfo = this.calculateStars(averageNumber);

      // Thêm đánh giá cho từng sản phẩm
      item.rating = rating;
      item.averageNumber = averageNumber;
      item.starsInfo = starsInfo;
    } else {
      // Không có đánh giá, bạn có thể thiết lập giá trị mặc định
      item.rating = 0;
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
ngOnInit(): void {
  this.route.paramMap.subscribe(query=>{
    this.id =query.get('id');
  })
  this.idType = Number( this.route.snapshot.params['id'] );
  this.d.getTenLoaiSanPham(this.idType).subscribe ( 
    loai =>  { this.name= loai[0].name; }    
  );
  this.d.getSanPhamTheoLoai(this.idType).subscribe(
    (res: HttpResponse<IProduct[]>) => {
        if (res.body) {
            this.listProduct = res.body;
        }
    },
    error => {
        console.error(error);
    }
);

this.h.get("http://localhost:8080/api/v0/home",
{observe: 'response'}
).subscribe(
res => { 
console.log("ok=", res.ok);
console.log("body=", res.body);
console.log("res=", res);
console.log("Content-Type=", res.headers.get('Content-Type'));
this.listSP= res.body;
// for(let i of this.listProduct) {
  this.getRatingListByProduct();
// }
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
}

