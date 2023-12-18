import { ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, HostListener, Injector, Input, Output, ViewChild } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
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
import { ProductService } from '../services/products.service';
import { TokenService } from '../services/token.service';
import { WishService } from '../services/wish.service';
import { AuthGuard } from '../guards/auth.guard';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  
  Images: any;
  Spec: any;
  rating: any = 0;
  products: any;
  infoProduct: any;
  id: any;
  customerId: any = this.tokenService.getCustomerId();
  checkData: any[] = [];
  count: number = 0;
  @Input() averageNumber: any;
  getRateElement: number[] = [];
  totalRate: any[] = [];
  starsInfo: { filled: boolean; half: boolean; noFill: boolean }[] = [];
  loading: boolean = false;
  feedBacks: any;
  nameCustomer: any;
  comment: any;
  data: any[] = [];
  responsiveOptions: any[] | undefined;
  selectedImageUrl: string = '';
  selectedIndex: number = 0;
  checkList: boolean = false;
  qrCodeImage: any;


  interval: any;
  startIndex = 0;
  displayedImg: any[] = [];
  currentFeedbacks: any[] = []; // Danh sách vouchers trên trang hiện tại
  itemsPerPage: number = 4; // Số lượng mục trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang

 
  constructor( 
    private rate:RatingService,
    private d:DataService,  
    private route:ActivatedRoute, 
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private fB: FeedbackService,
    private pS: ProductService,
    private tokenService: TokenService,
    private wish: WishService,
    private el: ElementRef,
    private authGuard: AuthGuard,
    private injector: Injector,
    private router: Router,
    private datePipe: DatePipe
  ) // private snackBar: MatSnackBar

  {
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
      images: [''],
    });
  }

   imageChange(imageUrl: string, index: number): void{
    this.selectedImageUrl = imageUrl;
    this.selectedIndex = index;
    console.log(this.selectedImageUrl);
  }
  prevSlide() {
    if (this.startIndex > 0) {
      this.startIndex -= 4;
    }
  }

  addToWish(product: IProduct) {
    this.wish.addToWish(product);
    Swal.fire({
      icon: 'success',
      title: 'Add To Wishlist Successfully',
      showConfirmButton: false,
      timer: 1000,
    });
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextSlide() {
    // Check if moving to the next set of 3 images won't go beyond the array length
    if (this.startIndex + 4 < this.Images.length) {
      this.startIndex += 4;
    } else {
      // If moving to the next set would go beyond, reset to the first set
      this.startIndex = 0;
    }
  }
  
  ngOnInit(): void {
    // this.updateDisplayedImages();
    // this.startInterval();

    this.id = Number(this.route.snapshot.params['id']);  
    
    this.d.getTakeProduct(this.id).subscribe ( 
      res => { 
        this.infoProduct  = res[this.id - 1];
        this.getRatingListByProduct(this.id);
        console.log('Dữ liệu mới đã được cập nhật:', this.infoProduct);
      });
    
    this.pS.getImagePro(this.id).subscribe((data) => {
      this.Images = data;
      this.selectedImageUrl = this.Images[0].imageUrl;
      console.log('Dữ liệu mới đã được cập nhật:', this.Images);
    });

    this.pS.getSpecPro(this.id).subscribe((data) => {
      this.Spec = data;
      console.log('Dữ liệu mới đã được cập nhật:', this.Spec);
    });

    this.loadFeedback();

    this.responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        },
        {
          breakpoint: '576px',
          numVisible: 1,
          numScroll: 1
        }
      ];
      
  }

  onClick() {
    const canActivate = this.authGuard.canActivate(
      {} as ActivatedRouteSnapshot,
      this.router.routerState.snapshot
    );
    if (canActivate) {
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
        const selectedValue = (
          document.getElementById('rating') as HTMLSelectElement
        ).value;
        console.log('User rated:', selectedValue);
        this.rate.getAllRatingList().subscribe((ratingData) => {
          this.loading = true;
          this.checkData = ratingData;
          console.log('Customer Id: ', this.customerId);
          for (let i of ratingData) {
            for (let r of this.checkData) {
              if (
                r.rating != null &&
                r.customers.id === this.customerId &&
                r.products.id === this.id
              ) {
                setTimeout(() => {
                  this.loading = false;
                  Swal.fire({
                    icon: 'info',
                    title: 'You had rated this product',
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }, 1200);
                this.checkList = true;
                break;
              }
            }
            if (this.customerId === i.customers.id && this.checkList == false) {
              const ratingForm = {
                nameCustomer:
                  i.customers.firstName + ' ' + i.customers.lastName,
                rating: selectedValue,
                createDate: new Date(),
                updateDate: new Date(),
                customers: { id: this.customerId },
                products: { id: this.id },
              };
              this.rate.sendDBRequest(ratingForm).subscribe(
                (response) => {
                  setTimeout(() => {
                    this.loading = false;
                    Swal.fire({
                      icon: 'success',
                      title: 'Rate Successfully',
                      showConfirmButton: false,
                      timer: 1000,
                    });
                  }, 1200);
                  console.log('response: ', response);
                  this.getRatingListByProduct(this.id);
                },
                (err) => {
                  setTimeout(() => {
                    this.loading = false;
                    Swal.fire({
                      icon: 'error',
                      title: 'Rate Failure',
                      showConfirmButton: false,
                      timer: 2000,
                    });
                  }, 4000);
                  console.log('error: ', err);
                }
              );
              break;
            }
          }
        });
      }
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Please log in first',
      showConfirmButton: false,
      timer: 2000,
    });
  }
  }

  calculateAverage(): number {
    if (this.getRateElement.length === 0) {
      return 0; // Tránh chia cho 0
    }

    let sum = 0;

    for (const rating of this.getRateElement) {
      if (typeof rating === 'number') {
        sum += rating;
      }
    }
    console.log('Sum Type:', typeof sum);
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
  calculateStars(
    average: number
  ): { filled: boolean; half: boolean; noFill: boolean }[] {
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

  image1: string =
    'https://cdn.tgdd.vn/Products/Images/42/230529/iphone-13-pro-max-xanh-la-thumb-600x600.jpg';

  // Hàm để thay đổi hình ảnh khi người dùng chọn
  changeImage(imageUrl: string): void {
    this.infoProduct.images = imageUrl;
  }
  addToCart(product: any) {
    this.cartService.addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added To Cart Successfully',
      showConfirmButton: false,
      timer: 1000,
    });
  }
  
  

  createFeedback(){
    this.id = Number(this.route.snapshot.params['id']);    
    const feedback = {
      nameCustomer: this.infoProduct.nameCustomer,
      comment: this.infoProduct.comment,
      status: '',
      createDate: new Date(),
      updateDate: new Date(),
      customers: { id: this.customerId },
      products: { id: this.id },
    };

    this.fB.createFeedBackProduct(feedback).subscribe(
      (response) => {
        console.log('Successfully Create Feedback!', response);
      },
      (error) => {
        console.error('Failed to Create Feedback:', error);
        window.location.reload();
      }
    );
  }
  generateQRCode() {
    const modifiedInfoProduct = this.modifyInfoProduct(this.infoProduct,this.Spec);
    this.d.getQRCode(modifiedInfoProduct).subscribe(
      (data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.qrCodeImage = reader.result;
        };
        reader.readAsDataURL(data);
      },
      (error) => {
        console.error('Error fetching QR code:', error);
      }
    );
  }
  modifyInfoProduct(infoProduct: any, spec : any): String {
    return  "Tên sản phẩm: " + infoProduct.name + 
    ", Giá đang bán: " + infoProduct.discountPercentage +
    ", Mô tả sản phẩm: " + infoProduct.description +
    ", Đang được giảm giá: " + infoProduct.discountPrice +
    ", Loại sản phẩm: " + infoProduct.categoryId.name +
    ", Hãng sản xuất: " + infoProduct.brandId.name +
    ", Sản phẩm được xuất xứ: " + infoProduct.originId.country +
    ", Số lượng còn lại: " + infoProduct.stockQuantity +
    ", Bộ xử lý con chip: " + spec.processor +
    ", Card đồ họa: " + spec.graphicsCard +
    ", Bộ nhớ xử lý: " + spec.ram +
    ", Bộ nhớ thiết bị: " + spec.storage +
    ", Kích thước chất lượng màn hình: " + spec.display +
    ", Hệ điều hành & nhà sản xuất: " + spec.operatingSystem +
    ", Chất lượng camera: " + spec.camera ;
  }


  shareOnFacebook(id: string) {
    let urlToShare = `http://localhost:4200/view/${id}`; // Replace with your actual URL
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlToShare,'facebook-share-dialog','width=626,height=436');
  }
  shareOnTwitter(id: string) {
    let urlToShare = `http://localhost:4200/view/${id}`;
    window.open(`https://twitter.com/intent/tweet?url=${urlToShare}`, '_blank');
  }

  shareOnInstagram(imageUrl: string) {
    let urlToShare = `https://www.instagram.com/sharer/sharer.php?u=${imageUrl}`;
    window.open(urlToShare, '_blank');
  }

  loadFeedback() {
        this.fB.getFeedBackProduct(this.id).subscribe((data) => {
         this.feedBacks = data;
         this.feedBacks.sort((a: any, b: any) => {
          const dateA = new Date(a['createDate'][0], a['createDate'][1] - 1, a['createDate'][2], a['createDate'][3], a['createDate'][4]).getTime();
          const dateB = new Date(b['createDate'][0], b['createDate'][1] - 1, b['createDate'][2], b['createDate'][3], b['createDate'][4]).getTime();
          return dateB - dateA;
        });
         for (let i of this.feedBacks) {
          const dateArray = i.updateDate;
          const dateObject = new Date(
            dateArray[0],
            dateArray[1] - 1,
            dateArray[2],
            dateArray[3],
            dateArray[4]
          );
          i.updateDate = this.datePipe.transform(dateObject, 'dd/MM/yyyy - hh:mm');
          console.log(i.updateDate);
        }
         console.log(this.feedBacks);
         this.calculateTotalPages();
         this.updateOrders();
       });
     }
  
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.feedBacks.length / this.itemsPerPage);
  }
  // Hàm để cập nhật danh sách vouchers trên trang hiện tại
  updateOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentFeedbacks = this.feedBacks.slice(startIndex, endIndex);
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateOrders();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateOrders();
    }
  }
}
