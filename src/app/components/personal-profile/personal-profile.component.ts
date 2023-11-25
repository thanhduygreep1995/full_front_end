import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../services/customer/customer.service';
import { DatePipe } from '@angular/common';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css'],
  providers: [DatePipe],
})
export class PersonalProfileComponent implements OnInit {
  id: any = this.tokenService.getCustomerId();
  changeProForm: FormGroup;
  ButtonSave: any;
  originalData: any;
  loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cS: CustomerService,
    private tokenService: TokenService
  ) {
    this.changeProForm = this.formBuilder.group({
      fullName: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      phoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.cS.getCustomerById(this.id).subscribe(
      (response: any) => {
        this.originalData = response;

        const formattedDate = this.datePipe.transform(
          response.dateOfBirth,
          'yyyy-MM-dd'
        );
        const fullName = this.combineFullName(
          response.firstName,
          response.lastName
        );
        // Tạo một đối tượng mới với fullName đã ghép
        const updatedResponse = {
          ...response,
          dateOfBirth: formattedDate,
          fullName: fullName,
        };
        this.changeProForm.patchValue(updatedResponse);
        const fullNameControl = this.changeProForm.get('fullName');
        if (fullNameControl) {
          fullNameControl.disable();
        }
      },
      (error) => {
        console.log(error);
        // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
      }
    );
  }
  combineFullName(firstName: string, lastName: string): string {
    return `${lastName} ${firstName}`;
  }

  fnUpdateProfile() {
    this.loading = true; // Hiển thị spinner
    const ProfileInfo = this.changeProForm.value;
    this.cS.updateProfile(this.id, ProfileInfo).subscribe(
      (response) => {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        console.log('Successfully updated Profile!');
        // alert('Successfully updated Profile!');
        const updatedFullName = this.combineFullName(
          this.changeProForm.value.firstName,
          this.changeProForm.value.lastName
        );
        this.changeProForm.patchValue({ fullName: updatedFullName });
      },
      (error) => {
        this.loading = false;
        console.error('Failed to update Profile:', error);
      }
    );
  }
}
