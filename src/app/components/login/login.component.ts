import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { LoginResponse } from '../response/login.response';
import { LoginDTO } from '../dtos/login.dto';
import { customerResponse } from '../response/customer.response';
import {CustomerService} from'../services/customer.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  email: string = 'haonvps24050@fpt.edu.vn';
  password: string = '1111111';
 customerResponse?: customerResponse


  constructor(
    private router: Router,
    private customerService: CustomerService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
  }

  login() {
    const message = `email: ${this.email}` +
    `password: ${this.password}`;
  //alert(message);
  // debugger
    const loginDTO: LoginDTO = {
      "email": this.email,
      "password": this.password,
    };

    this.customerService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        // debugger;
        const { token } = response;  
        this.tokenService.setToken(token); 
        this.customerService.getCustomerDetail(token).subscribe({
          next: (response: any) => {
            // debugger;
            this.customerResponse = {
              ...response, 
              // date_of_birth: new Date(customerResponse.date_of_birth),
            };
            this.customerService.saveCustomerResponseToLocalStorage(this.customerResponse);
            this.router.navigate(['/']).then(() => 
            {
              window.location.reload();
            })
          },
          complete: () => {
            // debugger;
          },
          error: (error: any) => {
            // debugger;
            alert(error.error.message);
          }
        });         
      },
      complete: () => {
        // debugger;
      },
      error: (error: any) => {
        // debugger;
        alert(error.error.message);
      }
    });
  }
}
