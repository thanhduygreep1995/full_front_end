import { Component } from '@angular/core';
import { OrderHistoryService } from '../services/order-history/order-history.service';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  products: any;
  infoOrder: any;
  id: any;
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
      customer: 5
    });
   }

   ngOnInit(): void {
    const customer = 1;
    this.oH.getAllByCustomerId(customer).subscribe((data) => {
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
