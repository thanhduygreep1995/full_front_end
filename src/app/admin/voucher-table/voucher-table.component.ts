import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { CategoryService } from '../service/category/category.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import 'datatables.net';
import 'datatables.net-buttons';
import { ButtonService } from '../service/button/buttonservice';
import { VoucherService } from '../service/voucher/voucher.service';
// import * as $ from 'jquery';

declare var require: any;
const jszip: any = require('jszip');
const pdfMake: any = require('pdfmake/build/pdfmake.js');
const pdfFonts: any = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
  timer: 2000
});

function customizeData(data: any[][]) {
  const newData = [];
  for (const row of data) {
    const newRow = [];
    for (const cell of row) {
      if (cell === 'AdminGoingUp') {
        newRow.push('Voucher');
      } else {
        newRow.push(cell);
      }
    }
    newData.push(newRow);
  }
  return newData;
}

@Component({
  selector: 'app-voucher-table',
  templateUrl: './voucher-table.component.html',
  styleUrls: ['./voucher-table.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300)
      ]),
      state('out', style({ opacity: 0 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class VoucherTableComponent {

  vouchers: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;

  constructor(
    private formBuilder: FormBuilder,
    private voucherS: VoucherService,
    public buttonService: ButtonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip', // Hiển thị các nút: buttons, filter, length change, ... (Xem thêm tài liệu DataTables để biết thêm thông tin)
      buttons: [
        {
          extend: 'colvis',
          className: 'btn-primary',
          columns: ':not(:last-child)',
        },

        {
          extend: 'copy',
          title: 'Admin - voucher',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - voucher',
          // customize: function (win : Window) {
          //   // Tùy chỉnh dữ liệu khi in
          //   const body = $(win.document.body);
          //   body.find('h1').text('Category'); // Đổi tên bảng in thành "Category"
          // },
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          title: 'Admin - Voucher',
          extend: 'excel',
          // customize: function (xlsx: any) {
          //   const sheet = xlsx.xl.worksheets['sheet1.xml'];
    
          //   // Tìm và thay thế tên cột trong tệp Excel
          //   $('row c[r^="A"] t', sheet).each(function () {
          //     if ($(this).text() == 'AdminGoingUp') {
          //       $(this).text('Category');
          //     }
          //   });
          // },
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Voucher',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };

    this.refreshTable();
  }

  fnDeleteCategory(id: any) {
    const voucherToDelete = this.vouchers.find((voucher: { id: any; }) => voucher.id == id);
    if (voucherToDelete) {
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Gửi yêu cầu xóa đến backend
          this.voucherS.delete(id).subscribe(() => {
            this.isSpinning = true;
            setTimeout(() => {
              this.isSpinning = false;
              Swal.fire({
                title: 'Deleted!',
                text: 'Your data has been deleted.',
                icon: 'success',
                confirmButtonColor: '#007BFF', // Màu khác bạn muốn sử dụng
                timer: 2000
              })
              console.log('Danh mục đã được xóa thành công');
              this.refreshTable();
            },this.progressTimerOut);
            this.refreshTable();
          }, (error) => {
            this.isSpinning = false;
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong. Please try again!',
              icon: 'error',
              confirmButtonColor: '#007BFF', // Màu khác bạn muốn sử dụng
              timer: 2000
            });
            console.error('Đã xảy ra lỗi khi xóa danh mục:', error);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.isSpinning = true;
          
          setTimeout(() => {
            this.isSpinning = false;
            Swal.fire({
              title: 'Cancelled!',
              text: 'Your data is safe :)',
              icon: 'success',
              confirmButtonColor: '#007BFF', // Màu khác bạn muốn sử dụng
              timer: 2000
            });
          },this.progressTimerOut);
        }
      });
    } else {
      // Hiển thị thông báo lỗi khi id không tồn tại trong danh sách
      swalWithBootstrapButtons.fire(
        'Error',
        'Category with the specified ID does not exist!',
        'error'
      );
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }
  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.voucherS.getAllVouchers().subscribe(
      (newData) => {
        this.vouchers = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.vouchers);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }
}
