import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../service/brand/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ButtonService } from '../service/button/buttonservice';
import { VoucherService } from '../service/voucher/voucher.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-voucher-edition',
  templateUrl: './voucher-edition.component.html',
  styleUrls: ['./voucher-edition.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 0 })),
      transition('void => *', [style({ opacity: 0 }), animate(300)]),
      state('out', style({ opacity: 0 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ],
})
export class VoucherEditionComponent {
  id: any;
  infoVoucher: FormGroup;

  ButtonSave: boolean = true;
  ButtonUpdate: boolean = true;
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  vouchers: any;

  constructor(
    private formBuilder: FormBuilder,
    private voucherService: VoucherService,
    private router: Router,
    private route: ActivatedRoute,
    public buttonService: ButtonService
  ) {
    this.infoVoucher = this.formBuilder.group({
      codeVoucher: ['', Validators.required],
      value: ['', Validators.required],
      status: ['', Validators.required],
      expiredDate: ['', Validators.required],
    });
    this.infoVoucher.valueChanges.subscribe(() => {
      this.ButtonSave = this.infoVoucher.invalid;
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.id = params['id'];
        this.voucherService.getVoucherById(this.id).subscribe(
          (response: any) => {
            this.infoVoucher.patchValue(response);
          },
          (error) => {
            console.log(error);
            // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
          }
        );
      } else {
        // Xử lý trường hợp không tìm thấy `id`, ví dụ chuyển hướng người dùng đến trang khác hoặc hiển thị thông báo lỗi
      }
    });
    this.defaultComboBox();
  }
  defaultComboBox(){
    this.infoVoucher.patchValue({
      status: 'ACTIVE', // hoặc 'INACTIVE'
    });
  }
  fnAddBrand() {
    const dataVoucher = this.infoVoucher.value;
    this.isSpinning = true;
    this.voucherService.createVoucher(dataVoucher).subscribe(
      (response) => {
        setTimeout(() => {
          this.isSpinning = false;
          this.infoVoucher.reset();
          Swal.fire({
            icon: 'success',
            title: 'Successfully Create Voucher',
            showConfirmButton: false,
            timer: 2000,
          });
          this.router.navigate(['admin/voucher-table']);
        }, this.progressTimerOut);
      },
      (error) => {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Your work has not been saved',
            showConfirmButton: false,
            timer: 2000,
          });
        }, this.progressTimerOut);
      }
    );
  }
}
