import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  infoCustomer: FormGroup;

  constructor(private formBuilder: FormBuilder) {
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
  
  onSubmit() {
    // Xử lý dữ liệu khi form được submit
  }
  

}
