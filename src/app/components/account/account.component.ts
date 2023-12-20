import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer/customer.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  customerInfo: any; // Khai báo biến để lưu thông tin khách hàng
  fullName: any;
  id: any = this.tokenService.getCustomerId();
  constructor(private customer: CustomerService,private tokenService: TokenService) {}
  ngOnInit(): void {
    this.customer.getCustomerById(this.id).subscribe((data: any) => {
      this.customerInfo = data; // Lưu thông tin khách hàng vào biến customerInfo
      this.fullName = `${data.lastName} ${data.firstName}`;
    });
  }
}
