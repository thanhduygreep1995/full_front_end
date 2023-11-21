import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
infoLogin: FormGroup;

constructor(private formBuilder: FormBuilder) {
  this.infoLogin = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}

  
  onSubmit() {
    // Xử lý dữ liệu khi form được submit
  }

}
