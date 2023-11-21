import { Component, OnInit } from '@angular/core';
import { BrandService } from '../service/brand/brand.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ButtonService } from '../service/button/buttonservice';

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
})

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrls: ['./brand-table.component.css'],
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
export class BrandTableComponent implements OnInit {
  brands: any;
  infoBrand: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;


  constructor(
    private formBuilder: FormBuilder,
    private bS: BrandService,
    private router: Router,
    public buttonService: ButtonService
  ) {
    this.infoBrand = this.formBuilder.group({
      id: [''],
      name: [''],
    });
  }
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
          title: 'Admin - Brand',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Brand',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'excel',
          title: 'Admin - Brand',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Brand',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };

    this.bS.getAllBrands().subscribe((data) => {
      console.log(data);
      this.brands = data;
    });
  }

  onUpdate(id: number): void {
    this.router.navigate(['/brand-edition', id]);
    this.buttonService.setShowButton5(true)
  }

  fnDeleteBrand(id: any) {
    const brandToDelete = this.brands.find((brand: { id: any; }) => brand.id == id);
    this.isSpinning = true;
    if (brandToDelete) {
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
          this.bS.deleteBrand(id).subscribe(() => {
            console.log('Danh mục đã được xóa thành công');
            setTimeout(() => {
              this.isSpinning = false;
              console.log('Danh mục đã được xóa thành công');
              this.infoBrand.reset();
              this.refreshTable();
              Swal.fire({
                title: 'Deleted!',
                text: 'Your data has been deleted.',
                icon: 'success',
                confirmButtonColor: '#007BFF', // Màu khác bạn muốn sử dụng
                timer: 2000
              })
            },this.progressTimerOut);
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
      this.isSpinning = false;
      Swal.fire({
        title: 'Error',
        text: 'Brand with the specified ID does not exist!',
        icon: 'error',
        confirmButtonColor: '#007BFF', // Màu khác bạn muốn sử dụng
        timer: 2000
      });
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }

  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.bS.getAllBrands().subscribe(
      (newData) => {
        this.brands = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.brands);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }
}
