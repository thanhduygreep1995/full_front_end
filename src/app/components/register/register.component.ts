import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerService } from '../services/customer/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  infoCustomer: FormGroup;
  loading: boolean = false
  constructor(private formBuilder: FormBuilder,private customerS: CustomerService,private router: Router) {
    this.infoCustomer = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.controls['password'].value;
    const confirmPassword = form.controls['confirmPassword'].value;
  
    if (password !== confirmPassword) {
      form.controls['confirmPassword'].setErrors({ mismatch: true });
    } else {
      form.controls['confirmPassword'].setErrors(null);
    }
  }
  
  register() {
    if (this.infoCustomer.valid) {
      this.loading = true; // Hiển thị spinner
      const formData = this.infoCustomer.value;
      this.customerS.createCustomer(formData).subscribe(
        (response) => {
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          if (error && error.error) {
            setTimeout(() => {
              this.loading = false; // Ẩn spinner khi xảy ra lỗi
              Swal.fire({
                icon: 'error',
                title: error.error,
                showConfirmButton: false,
                timer: 2500,
              });
            }, 1500);
          }
        }
      );
    }
  }

}
