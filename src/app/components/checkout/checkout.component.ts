import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
import Swal from 'sweetalert2';
import { CheckoutService } from '../services/checkout/checkout.service';
import { LocationService } from '../services/location/location.service';
import { PaymentService } from '../services/payment/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OderCompleteComponent } from '../oder-complete/oder-complete.component';
import { TokenService } from '../services/token.service';
import { ProductService } from '../services/products.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  cartItems: any[] = [];
  tt: number = this.cartService.tongtien();
  cities!: any[];
  districts!: any[];
  wards!: any[];
  id: any = this.tokenService.getCustomerId();
  applied = false;
  loading: boolean = false;
  voucher: any;
  formCoupon: FormGroup;
  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private router: Router,
    private locationService: LocationService,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private productService: ProductService
  ) {
    this.route.queryParams.subscribe((params) => {
      let vnpResponseCode = params['vnp_ResponseCode'];
      const codeVoucher = this.checkoutService.getVoucherCode();
      switch (vnpResponseCode) {
        case '00':
          this.router.navigate(['/oder-complete']);
          if(codeVoucher){
            this.checkoutService
            .useVoucherByCode(codeVoucher)
            .subscribe();
          }
          console.log('Giá trị của vnp_ResponseCode00:', vnpResponseCode);
          this.createOrderVNP();
          this.processPayment();
          break;
        case '05':
        case '06':
        case '07':
        case '09':
        case '10':
        case '11':
        case '12':
        case '79':
        case '65':
        case '75':
        case '99':

        case '24':
          this.router.navigate(['/oder-failure']);
          console.log('Giá trị của vnp_ResponseCode00:', vnpResponseCode);
          break;

        default:
          this.router.navigate(['/checkout']);
          console.log('Giá trị của vnp_ResponseCode:', vnpResponseCode);
      }
    });

    this.cartItems = this.cartService.getItems();
    this.formCoupon = this.formBuilder.group({
      codeVoucher: [''],
    });
    this.locationService.getCities().subscribe((data) => {
      this.cities = data;
    });
    this.clearAddress();
  }
  name: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  paymentMethod: string = '';
  city: any;
  district: any;
  ward: any;

  createOrderVNP(){
    const retrievedOrderData = this.checkoutService.getOrderData();
    this.checkoutService.createOrder(retrievedOrderData).subscribe((response) => {
    this.createOrderDetail(response.id)
    });
    this.checkoutService.clearOrderData();
  }
  clearAddress() {
    this.city = [0];
    this.district = [0];
    this.ward = [0];
  }
  taodonhang() {
    this.cartService
      .taoDonHang(this.name, this.address, this.phone, this.email)
      .subscribe((response) => {
        console.log(response);
      });
  }
  discount() {
    if (!this.applied) {
      this.loading = true;
      const codeVoucher = this.formCoupon.value.codeVoucher;
      this.checkoutService.getVoucherByCode(codeVoucher, this.id).subscribe(
        (data) => {
          this.loading = false;
          this.voucher = data;
          this.applyDiscount();
        },
        (error: HttpErrorResponse) => {
          if (error && error.error) {
            setTimeout(() => {
              this.loading = false; // Ẩn spinner khi xảy ra lỗi
              Swal.fire({
                icon: 'error',
                title: error.error,
                showConfirmButton: false,
                timer: 2500,
              });
            }, 1500);
          }
        }
      );
    }
  }
  applyDiscount() {
    if (this.voucher && this.voucher.value) {
      this.tt -= this.voucher.value;
    }
    this.applied = true;
  }

  onCityChange() {
    const selectedCityId = this.city; // Lấy giá trị thành phố đã chọn từ biến city
    const city = this.cities.find((c) => c.Id === selectedCityId); // Tìm thành phố tương ứng trong danh sách các thành phố
    if (city) {
      this.districts = city.Districts; // Gán danh sách quận/huyện cho districts
    } else {
      this.districts = []; // Nếu không tìm thấy thành phố, gán districts thành mảng trống
    }
  }

  onDistrictChange() {
    const selectedDistricId = this.district; // Lấy giá trị thành phố đã chọn từ biến city
    const distric = this.districts.find((d) => d.Id === selectedDistricId); // Tìm thành phố tương ứng trong danh sách các thành phố
    if (distric) {
      this.wards = distric.Wards; // Gán danh sách quận/huyện cho districts
    } else {
      this.wards = []; // Nếu không tìm thấy thành phố, gán districts thành mảng trống
    }
  }
  //các hàm
  createPayment(amount: number) {
    this.paymentService
      .createPayment(amount)
      .subscribe((response) => {
        window.open(response, '_self');
      });
  }

  voucherStatus() {
    if (this.formCoupon.value.codeVoucher) {
      this.checkoutService
        .useVoucherByCode(this.formCoupon.value.codeVoucher)
        .subscribe();
    }
  }
  receiveCode(code: string) {
    this.checkoutService.setVoucherCode(code);
  }
  placeOrder() {
    if (this.paymentMethod === 'Cash') {
      this.voucherStatus();
      this.createNewOrder();
      this.processPayment();
      this.router.navigate(['/oder-complete']);
    } else if (this.paymentMethod === 'VnPay') {
      this.receiveCode(this.formCoupon.value.codeVoucher);
      this.createPayment(this.tt);
      this.onOrder();
    }
  }
  // getTotal(): number {
  //   return this.tt;
  // }
  isDiscount(): any {
    if (this.voucher && this.voucher.value) {
      return this.voucher.value;
    } else {
      return 0;
    }
  }
  createOrderData(): any {
    const orderData: any =  {
      name: this.name,
      email: this.email,
      address: this.address + ', ' + this.ward + ', ' + this.district + ', ' + this.city,
      phone: this.phone,
      status: 'PENDING',
      paymentMethod: this.paymentMethod,
      discountPrice: this.isDiscount(),
      totalAmount: this.tt,
      customer: {
        id: this.id,
      },
    };
    return orderData;
  }

  onOrder(){
    const orderData = this.createOrderData();
    this.checkoutService.setOrderData(orderData)
  }
  createNewOrder(): void {
    const orderData = this.createOrderData();
    this.checkoutService.createOrder(orderData).subscribe((response) => {
      console.log('create success order');
      this.createOrderDetail(response.id);
    });
  }
  createOrderDetail(id: number){
    this.cartItems.forEach((item) => {
        const orderDetailData = {
          quantity: item.soluong,
          totalPrice: item.tongTien,
          order: {
            id: id, // Assuming you have orderId from somewhere
          },
          product: {
            id: item.id, // Assuming 'id' in your data refers to product ID
          },
        };
        this.checkoutService
          .createOrderDetail(orderDetailData)
          .subscribe((detailResponse) => {
            console.log('create success orderdetail');
          });
        this.updateStockQuantity(item.id, item.soluong);
      });
  }
  updateStockQuantity(id: number, quantity: number) {
    const productDTO = {
      id: id,
      stockQuantity: quantity,
    };
    this.productService.updateProductStock(productDTO).subscribe((response) => {
      console.log('Stock updated successfully', response);
    });
  }
  processPayment() {
    // Implement payment processing logic here
    // ...

    this.cartService.clearCart();
  }
}
