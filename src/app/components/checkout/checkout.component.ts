import { Component, NgModule } from '@angular/core';
import { IProduct } from 'src/app/components/interfaces/iproduct';
import { CartService } from 'src/app/components/services/cart.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
   cartItems: any[] = [];
  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getItems();
   }
  name: string = "";
  email: string = "";
  address: string = "";
  phone: string = "";
  taodonhang() {
    this.cartService.taoDonHang(this.name, this.address, this.phone, this.email).subscribe(response=>{
      console.log(response)
    })
  }

    
  getTotal(): number {
    return this.cartService.tongtien();
  }

  processPayment() {
    // Implement payment processing logic here
    // ...

    this.cartService.clearCart();
  }
}