import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { VoucherService } from '../services/voucher/voucher.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = []; // Danh sách vouchers
  currentVouchers: any[] = []; // Danh sách vouchers trên trang hiện tại
  itemsPerPage: number = 4; // Số lượng mục trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang
  loading: boolean = false;
  addVoucherForm: FormGroup;
  id: any = 1;
  constructor(
    private clipboardService: ClipboardService,
    private voucherService: VoucherService,
    private formBuilder: FormBuilder
  ) {
    this.addVoucherForm = this.formBuilder.group({
      codeVoucher: ['', Validators.required],
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.vouchers.length / this.itemsPerPage);
  }
  // Hàm để cập nhật danh sách vouchers trên trang hiện tại
  updateVouchers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentVouchers = this.vouchers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVouchers();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVouchers();
    }
  }

  ngOnInit() {
    this.loadVoucher();
  }
  loadVoucher() {
    this.voucherService.getAllByCustomerId(this.id).subscribe((data) => {
      this.vouchers = data;
      this.vouchers.sort((a, b) => {
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') {
          return -1; // 'Active' appears before other statuses
        } else if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') {
          return 1; // 'Active' appears after other statuses
        } else {
          return 0; // No change in order
        }
      });
      this.calculateTotalPages();
      this.updateVouchers();
    });
  }
  copyContent(content: string): void {
    if (content) {
      this.clipboardService.copyFromContent(content);
      alert('Voucher code copied to clipboard: ' + content);
    } else {
      console.error('Invalid voucher code:', content);
    }
  }

  addMyVoucher() {
    if(this.addVoucherForm.valid){
    const formData = {
      codeVoucher: this.addVoucherForm.value.codeVoucher,
      customerId: this.id,
    };
    this.loading = true; // Hiển thị spinner
    this.voucherService.addMyVoucher(formData).subscribe(
      (response) => {
        setTimeout(() => {
          this.loading = false; // Ẩn spinner khi xảy ra lỗi
          this.loadVoucher();
          Swal.fire({
            icon: 'success',
            title: 'Add discount code successfully',
            showConfirmButton: false,
            timer: 1000,
          });
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
