import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer/customer.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.css'],
})
export class AccountSidebarComponent implements OnInit {
  fullName: any;
  id: any = this.tokenService.getCustomerId();

  constructor(private customerS: CustomerService,private tokenService: TokenService) {}
  ngOnInit() {
    // Gọi hàm getCustomerById với ID của khách hàng cụ thể (ví dụ: 123)
    this.customerS.getCustomerById(this.id).subscribe((data: any) => {
      this.fullName = `${data.lastName} ${data.firstName}`;
    });
  }
  logout(){
    this.customerS.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();
  }
}
