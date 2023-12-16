import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { LoginResponse } from '../response/login.response';
import { LoginDTO } from '../dtos/login.dto';
import { customerResponse } from '../response/customer.response';
import {CustomerService} from'../services/customer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  customerResponse?: customerResponse


  constructor(
    private router: Router,
    private customerService: CustomerService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    const rememberedEmail = this.customerService.getRememberedEmail();
    if (rememberedEmail) {
      this.email = rememberedEmail; // Nếu có email được nhớ, gán vào trường email
    }
  }
  changeRemember(): void{
    this.rememberMe = !this.rememberMe
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
        const mess = response.message;
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
            this.customerService.saveLoginInfoToLocalStorage(this.email, this.rememberMe);
            Swal.fire({
              icon: 'success',
              title: mess,
              showConfirmButton: false,
              timer: 1000,
            });
            setTimeout(() => {
              this.router.navigate(['/']).then(() => 
              {
                window.location.reload();
              })
              }, 1500);
          },
          complete: () => {
            // debugger;
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: error.error.message,
              showConfirmButton: false,
              timer: 1000,
            });
            // debugger;
            // alert(error.error.message);
          }
        });         
      },
      complete: () => {
        // debugger;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.error.message,
          showConfirmButton: false,
          timer: 1000,
        });
        // debugger;
        // alert(error.error.message);
      }
    });
  }
}
