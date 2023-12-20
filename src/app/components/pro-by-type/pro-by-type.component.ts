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
  listSP: any;
  selectedProducts: any[] = [];
  listProduct: any[] = [];
  products: any;
  filteredProducts: any[] = [];
  starsInfo: { filled: boolean, half: boolean, noFill: boolean }[] = [];
  starsInfo1: { filled: boolean, half: boolean, noFill: boolean }[] = [];
  productId: any;
  constructor(private h: HttpClient, private route: ActivatedRoute,
    private d: DataService, private cart: CartService,
    private wish: WishService,
    private productService: ProductService,
    private rP: RatingService,
    private router: Router
  ) {

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
  getRatingListByProduct1() {
    if (!this.products) {
      console.error('products is undefined or null.');
      return;
    }
    this.products.forEach((item: any) => {
      // console.log('Product total_r:', item.total_rate);
      console.log('Product:', item); // Kiểm tra xem dữ liệu sản phẩm có đúng không
      console.log('Product total_r:', item.total_rate); 
      if (item.total_rate != 0 && item.ratingProduct.length != 0) {
        const averageRating = item.total_rate / item.ratingProduct.length;
        const averageNumber = this.customRound(averageRating);
        const starsInfo1 = this.calculateStars(averageNumber);
  
        // Thêm đánh giá cho từng sản phẩm
        item.averageRating = averageRating;
        item.averageNumber = averageNumber;
        item.starsInfo1 = starsInfo1;
      } else {
        // Không có đánh giá, bạn có thể thiết lập giá trị mặc định
        item.averageRating = 0;
        item.averageNumber = 0;
        item.starsInfo1 = this.calculateStars(0);
      }
  
      // console.log('Product after rating:', item); // Kiểm tra xem dữ liệu đã được gán đúng không
    });
  }

  getRatingListByProduct() {
    if (!this.listProduct) {
      console.error('products is undefined or null.');
      return;
    }
    this.listProduct.forEach((item: any) => {
      console.log('Product:', item); // Kiểm tra xem dữ liệu sản phẩm có đúng không
      console.log('Product total_r:', item.total_rate);
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
  addToCart(product: IProduct) {
    this.cart.addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added To Cart Successfully',
      showConfirmButton: false,
      timer: 1000
    })
  }
  addToWish(product: IProduct) {
    this.wish.addToWish(product);
    Swal.fire({
      icon: 'success',
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
  preListCategoryId: any = [];
  currListCategoryId: any = [];
  ngOnInit(): void {
 

    this.productService.getProducts().subscribe(data => {
      this.products = data;

      this.products.forEach((product: any) => {
        const productId = product.id;
        console.log('Erro type:',typeof(productId));
        this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
          console.log('Erro rating:',ratingData);
          product.total_rate = ratingData || 0;
          // console.log('Erro rating:',ratingData);
          this.getRatingListByProduct1();
        });
      });
    },
    error => {
      console.error('Error fetching products:', error);
    }
  );
  
    
    console.log("listTypeProduct", this.selectedProducts);

    this.route.paramMap.subscribe(query => {
      this.id = query.get('id');
    });


    this.idType = Number(this.route.snapshot.params['id']);

    this.d.getTenLoaiSanPham(this.idType).subscribe(
      loai => {
        this.name = loai[0].name;
      }
    );



    this.d.categoryAsOsb.subscribe(data => {
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

                  console.log('producttotal', product.total_rate);
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

  fillAllProducts() {
    // Lấy tất cả sản phẩm từ API hoặc từ service của bạn
    this.productService.getProducts().subscribe(
      data => {
        this.products = data;
  

          // Nếu có sản phẩm, lấy thông tin đánh giá và hiển thị
          this.products.forEach((product: any) => {
            const productId = product.id;
            this.rP.getTotalByProductId(productId).subscribe((ratingData) => {
              product.total_rate = ratingData || 0;
              console.log('producttotal', product.total_rate);
              console.log('product1',product.id);
              this.getRatingListByProduct1();
            });

          });
       

      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  // onSaveAllClick() {
  //   this.saveAllToSelectedProducts();

  //   console.log("listTypeProduct", this.selectedProducts);
  // }
  // // Lưu sản phẩm vào một mảng khác (ví dụ: danh sách sản phẩm đã được chọn)
  // saveAllToSelectedProducts() {
  //   // Kiểm tra xem listProduct có dữ liệu không
 
  //      if (this.selectedProducts.length === 0 || this.selectedProducts === null) {
  //     this.selectedProducts =[];
  //     this.fillAllProducts();
  //   }
  // }
}

