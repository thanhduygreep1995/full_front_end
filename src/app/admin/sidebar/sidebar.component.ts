import { Component, OnInit } from '@angular/core';
import { customerResponse } from 'src/app/components/response/customer.response';
import { CustomerService } from 'src/app/components/services/customer.service';
import { TokenService } from 'src/app/components/services/token.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private customerService: CustomerService,
    private tokenService: TokenService,
    ) { }
  customerResponse?: customerResponse | null
  ngOnInit(): void {
    this.customerResponse = this.customerService.getCustomerResponseFromLocalStorage();
  }
  logout() {
    this.customerService.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();
  }
}
