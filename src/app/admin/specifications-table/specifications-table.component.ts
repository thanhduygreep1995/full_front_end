import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { FormBuilder } from '@angular/forms';
import { SpecService } from '../service/specification/Spec.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { ButtonService } from '../service/button/buttonservice';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
  timer: 2000
});

declare var require: any;
const jszip: any = require('jszip');
const pdfMake: any = require('pdfmake/build/pdfmake.js');
const pdfFonts: any = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-specifications-table',
  templateUrl: './specifications-table.component.html',
  styleUrls: ['./specifications-table.component.css'],
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

export class SpecificationsTableComponent implements OnInit {
  specs: any;
  SpecForm: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  showButton3: boolean = false;
  ButtonSave: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private ss: SpecService,
    private router: Router,
    public buttonService: ButtonService
  ) {
    this.SpecForm = this.formBuilder.group({
      id: [''],
      processor: [''],
      graphicsCard: [''],
      ram: [''],
      storage: [''],
      display: [''],
      operatingSystem: [''],
      camera: [''],
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
          title: 'Admin - Specification',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Specification',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'excel',
          title: 'Admin - Specification',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Specification',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };

    this.ss.getAllSpec().subscribe((data) => {
      console.log(data);
      this.specs = data;
    });
  }
  onUpdate(id: number): void {
    this.router.navigate(['/specifications-edition', id])
    this.buttonService.setShowButton3(true)
  }

  fnDeleteProduct(id: any) {
    const specificationToDelete = this.specs.find((Spec: { id: any; }) => Spec.id == id);
    if (specificationToDelete) {
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
          this.ss.deleteSpec(id).subscribe(() => {
            this.isSpinning = true;
            console.log('Danh mục đã được xóa thành công');
            setTimeout(() => {
              this.isSpinning = false;
              console.log('Danh mục đã được xóa thành công');
              window.location.reload();
              this.SpecForm.reset();
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
        'Specification with the specified ID does not exist!',
        'error'
      );
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }

  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.ss.getAllSpec().subscribe(
      (newData) => {
        this.specs = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.specs);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
      );
    }
  }