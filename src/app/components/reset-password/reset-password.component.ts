import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  loading: boolean = false;
  showSuccessMessage: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private cus: CustomerService,private router: Router) {
    this.resetPasswordForm = this.formBuilder.group({
      resetPasswordToken: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.loading = true; // Hiển thị spinner
      const resetData = this.resetPasswordForm.value;
      this.cus.resetPassword(resetData).subscribe(
        () => {
            setTimeout(() => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                title: 'Reset password successfully',
                showConfirmButton: false,
                timer: 1000,
              });
              setTimeout(() => {
              this.router.navigate(['/login']);
              },2000);
            }, 1500);
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
