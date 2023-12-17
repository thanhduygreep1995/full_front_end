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
        newRow.push('Category');
      } else {
        newRow.push(cell);
      }
    }
    newData.push(newRow);
  }
  return newData;
}

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css'],
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
export class CategoryTableComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  categories: any;
  infoCategory: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  seclectedCategoryId: any;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cate: CategoryService,
    public buttonService: ButtonService,
    private router: Router
  ) {
    this.infoCategory = this.formBuilder.group({
      id: [''],
      name: [''],
      description: [''],
      status: [''],
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
          title: 'Admin - Category',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Category',
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
          title: 'Admin - Category',
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
          title: 'Admin - Category',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };

    this.refreshTable();
  }
  onUpdate(id: number): void {
    this.router.navigate(['admin/category-edition', id])
    this.buttonService.setShowButton4(true);
  }

  fnDeleteCategory(id: any) {
    const categoryToDelete = this.categories.find((category: { id: any; }) => category.id == id);
    if (categoryToDelete) {
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
          this.cate.deleteCategory(id).subscribe(() => {
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
    this.cate.getAllCategories().subscribe(
      (newData) => {
        this.categories = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.categories);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }

  onFileChange(event: any) {
    const reader = new FileReader();
  
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
    }
  }

  openProduct(categoryId: number) {
    this.cate.getCategoryById(categoryId).subscribe((data) => {
      this.seclectedCategoryId = data;
      console.log('Selected Product ID:', data)
      // for(let i of this.seclectedProductId){
      //   this.setProduct(i.id, i.model);
      // }
    },
    (error) => {
      console.error('Error', error);
  });
  }

  updateThumbImage(id: any){
    if (!this.selectedImage) {
      console.log('Image cant find');
      return;
    }
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    const file = (fileInput.files as FileList)[0];
    this.cate.updateThumbImage(id, file).subscribe(
      (response) => {
        console.log('Image update successfully', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error update image', error);
      }
    );
  }
}
