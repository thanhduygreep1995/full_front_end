import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleDriveService } from '../service/google-drive/google-drive.service';
import { ProductService } from '../service/product/product.service';
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
  selector: 'app-image-list',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
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
export class ImageComponent {
  images: any;
  imageForm: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  product: any;
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  selectedImageId: any;
  seclectedProductId: any;
  enableInputsClicked: boolean = false;
  understoodButtonVisible: boolean = false;
  modalClosed: boolean = false;
  allowInputEdit: boolean = true; 
  selectedImage: string | ArrayBuffer | null = null;
  form: any;
  initialImageFormState: any;
  initialSelectedImage: string | ArrayBuffer | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private iS: GoogleDriveService,
    private router: Router,
    private pS: ProductService,
    public buttonService: ButtonService
  ) 
  {
    this.imageForm = this.formBuilder.group({
      id: [''],
      title: [''],
      imageUrl: [''],
      createDate: [''],
      updateDate: [''],
      imageStatus: [''],
      products: [''],
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
      this.product = data.map((product, index) =>({...product, index: index + 1}));
    });
    
    this.iS.getAllImage().subscribe((data) => {
      console.log(data);
      this.images = data.map((image, index) =>({...image, index: index + 1}));
    });

    this.initialImageFormState = { ...this.imageForm.value };
    this.initialSelectedImage = this.selectedImage;
  }



openImage(imageId: number): void {
    this.iS.getImageById(imageId).subscribe((data) => {
      this.selectedImageId = data;
    },
    (error) => {
      console.error('Error', error);
  });
}

openProduct(productId: number): void {
  this.pS.getProductById(productId).subscribe((data) => {
    this.seclectedProductId = data;
  },
  (error) => {
    console.error('Error', error);
});
}

  onUpdate(id: number): void {
    this.router.navigate(['/image-edition', id]);
    this.buttonService.setShowButton2(true)
  }

  fnDeleteImage(id: any) {
    const imageToDelete = this.images.find((image: {id: any;}) => image.id == id);
    if (imageToDelete) {
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
          this.iS.deleteImage(id).subscribe(() => {
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
              console.log('Ảnh đã được xóa thành công');
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
            console.error('Đã xảy ra lỗi khi xóa ảnh:', error);
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
        'Image with the specified ID does not exist!',
        'error'
      );
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }

  refreshImageTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.iS.getAllImage().subscribe(
      (newData) => {
        this.images = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.images);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }

  refreshProductTable() {
    this.pS.getAllProduct().subscribe((data) => {
      console.log(data);
      this.product = data.map((product, index) =>({...product, index: index + 1}));
    });
  }

  refreshTable(){
    this.refreshImageTable();
    this.refreshProductTable();
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

  uploadImage(): void {
    if (this.seclectedProductId && this.seclectedProductId.id !== undefined) {
      this.imageForm.value.productId = this.seclectedProductId.id;
    }
    if (!this.selectedImage) {
      console.log('Image cant find');
      return;
    }
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    const productId = this.imageForm.value.productId; 
    const statusImage = this.imageForm.value.statusImage; 
    const file = (fileInput.files as FileList)[0];
    this.iS.createImage(file, productId, statusImage).subscribe(
      (response) => {
        console.log('Image uploaded successfully', response);
        this.refreshTable();
      },
      (error) => {
        console.error('Error uploading image', error);
      }
    );
    window.location.reload();
  }

  deleteImage(id: any){
    this.iS.deleteImage(id).subscribe(
      (response) => {
        console.log('Image delete successfully', response);
        this.refreshTable();
        
      },
      (error) => {
        console.error('Error delete image', error);
      }
    );
    this.handleClose();
    window.location.reload();
  }

  updateImage(id: any){
    if (this.selectedImageId && this.selectedImageId.imageStatus !== undefined) {
      this.imageForm.value.imageStatus = this.selectedImageId.imageStatus;
    }
    if (!this.selectedImage) {
      console.log('Image cant find');
      return;
    }

    const fileInput = document.getElementById('imageCreate') as HTMLInputElement;
    const statusImage = this.imageForm.value.statusImage; 
    const file = (fileInput.files as FileList)[0];
    this.iS.updateImage(file, statusImage, id).subscribe(
      (response) => {
        console.log('Image update successfully', response);
        this.refreshTable();
      },
      (error) => {
        console.error('Error update image', error);
      }
    );
    this.handleClose();
    window.location.reload();
  }

  enableInputs() {
    var inputs = document.querySelectorAll('#staticBackdrop input');
    inputs.forEach(function(input) {
        input.removeAttribute('disabled');
    });
    this.enableInputsClicked = true;
    this.understoodButtonVisible = true;
    this.modalClosed = false;
    this.allowInputEdit = false;
  }

  handleUnderstoodClick() {
      this.understoodButtonVisible = !this.understoodButtonVisible;
      this.allowInputEdit = true;
  }

  handleClose() {
      this.modalClosed = true;
      this.enableInputsClicked = false;
      this.understoodButtonVisible = false;
      this.allowInputEdit = true;
  }

  resetFormAndImage(): void {
    this.imageForm.setValue(this.initialImageFormState);
    this.selectedImage = this.initialSelectedImage;
  }
}
