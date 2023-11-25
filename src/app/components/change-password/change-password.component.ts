import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import Swal from 'sweetalert2';
import { TokenService } from '../services/token.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  id: any = this.tokenService.getCustomerId();
  changePasswordForm: FormGroup;
  loading: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private customerS: CustomerService,
    private tokenService: TokenService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.controls['newPassword'].value;
    const confirmPassword = form.controls['confirmPassword'].value;

    if (newPassword !== confirmPassword) {
      form.controls['confirmPassword'].setErrors({ mismatch: true });
    } else {
      form.controls['confirmPassword'].setErrors(null);
    }
  }
  ngOnInit() {}
  changePassword() {
    if (this.changePasswordForm.valid) {
      this.loading = true; // Hiển thị spinner
      const formData = this.changePasswordForm.value;
      this.customerS.changepassword(this.id, formData).subscribe(
        (response) => {
          setTimeout(() => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Change password successfully',
              showConfirmButton: false,
              timer: 1000,
            });
            this.changePasswordForm.reset();
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
