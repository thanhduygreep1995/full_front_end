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
  orders: any[] = [];
  orderDetailsState: { [orderId: number]: boolean } = {};
  total: any;
  currentOrders: any[] = []; // Danh sách vouchers trên trang hiện tại
  itemsPerPage: number = 4; // Số lượng mục trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang

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
    this.loadOrder();
    console.log(this.data);  
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

loadOrder() {
  this.oH.getAllByCustomerId(this.id).subscribe((data) => {
    this.orders = data;
    this.orders.sort((a: any, b: any) => {
      const dateA = new Date(a['orderDate']).getTime();
      const dateB = new Date(b['orderDate']).getTime();
      return dateB - dateA;
    });
    console.log(this.orders);
    this.calculateTotalPages();
    this.updateOrders();
  });
}

calculateTotalPages() {
  this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
}
// Hàm để cập nhật danh sách vouchers trên trang hiện tại
updateOrders() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.currentOrders = this.orders.slice(startIndex, endIndex);
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
