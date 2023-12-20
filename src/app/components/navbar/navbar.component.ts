import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Itypeprd } from '../interfaces/itypeprd';
import { customerResponse } from '../response/customer.response';
import { TokenService } from '../services/token.service';
import { CustomerService } from '../services/customer.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private d:DataService,
    private customerService: CustomerService,
    private tokenService: TokenService,
    ) { }
  listTypePro:Itypeprd[] = [];
  customerResponse?: customerResponse | null
  ngOnInit(): void {
    this.customerResponse = this.customerService.getCustomerResponseFromLocalStorage();
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
  }
  logout() {
    this.customerService.removeCustomerResponseFromLocalStorage();
    this.tokenService.removeToken();

  }
}
