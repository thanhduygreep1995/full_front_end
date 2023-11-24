import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { FormBuilder } from '@angular/forms';
import { BrandService } from '../service/brand/brand.service';
import { OriginService } from '../service/origin/origin.service';
import { Router } from '@angular/router';
import { ProductService } from '../service/product/product.service';
import { CategoryService } from '../service/category/category.service';
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
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
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
export class ProductTableComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  products: any;
  productForm: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  brands: any;
  origins:any;
  categories: any;
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  seclectedId: any;
  selectedImage: string | ArrayBuffer | null = null;
  seclectedProductId: any;

  constructor(
    private formBuilder: FormBuilder,
    private pS: ProductService,
    private router: Router,
    private bS: BrandService,
    private oS: OriginService,
    private cS: CategoryService,
    public buttonService: ButtonService
  ) 
  {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: [''],
      model: [''],
      price: [''],
      stockQuantity: [''],
      thumbnail:[''],
      description: [''],
      discountPercentage: [''],
      discountPrice: [''],
      status: [''],
      origin: [''],
      brand: [''],
      category: [''],
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
          title: 'Admin - Product',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Product',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'excel',
          title: 'Admin - Product',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Product',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };

    this.pS.getAllProduct().subscribe((data) => {
      console.log(data);
      this.products = data.map((product, index) =>({...product, index: index + 1}));
    });

    this.bS.getAllBrands().subscribe((data) => {
      this.brands = data;
    });
    this.oS.getAllOrigins().subscribe((data) => {
      this.origins = data;
    });
    this.cS.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  onUpdate(id: number): void {
    this.router.navigate(['admin/product-edition', id]);
    this.buttonService.setShowButton2(true)
  }

  fnDeleteProduct(id: any) {
    const productToDelete = this.products.find((product: {id: any;}) => product.id == id);
    if (productToDelete) {
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
          this.pS.deleteProduct(id).subscribe(() => {
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
              console.log('Sản phẩm đã được xóa thành công');
              window.location.reload();
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
            console.error('Đã xảy ra lỗi khi xóa Sản phẩm:', error);
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
        'Product with the specified ID does not exist!',
        'error'
      );
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }

  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.pS.getAllProduct().subscribe(
      (newData) => {
        this.products = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.products);
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

  openProduct(productId: number) {
    this.pS.getProductById(productId).subscribe((data) => {
      const productData = JSON.parse(data);
      this.seclectedProductId = productData;
      // console.log('Selected Product ID:', productData)
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
    this.pS.updateThumbImage(id, file).subscribe(
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
