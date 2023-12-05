import { Component } from '@angular/core';
import { OrderHistoryService } from '../services/order-history/order-history.service';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  products: any;
  infoOrder: any;
  id: any = this.tokenS.getCustomerId();
  feedBacks: any;
  data: [] = [];
  nameCustomer: any;
  comment: any;
  orders: any;
  orderDetailsState: { [orderId: number]: boolean } = {};
  total: any;

  constructor( 
    private formBuilder: FormBuilder,
    private oH: OrderHistoryService,
    private tokenS: TokenService
  ) {
    this.infoOrder = this.formBuilder.group({
      id: [''],
      email: [''],
      phone: [''],
      orderDate: new Date(),
      note: [''],
      status: [''],
      paymentMethod: [''],
      discountPrice: [''],
      orderDetail: [''],
      customer: ['']
    });
   }

   ngOnInit(): void {
    this.oH.getAllByCustomerId(this.id).subscribe((data) => {
      console.log(data);  
      this.orders = data;

    });

    
   }

toggleDetails(orderId: number) {
  this.orderDetailsState[orderId] = !this.orderDetailsState[orderId];
}

calculateTotal(order: any): number {
  let total = 0;
  for (let oD of order.orderDetail) {
    total += oD.totalPrice;
  }
  return total;
}



}
