import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../service/order/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../service/customer/customer.service';
import { ButtonService } from '../service/button/buttonservice';
import { OrderDetailService } from '../service/orderdetail/orderdetail/orderdetail.service';
import { ProductService } from '../service/product/product.service';
import * as moment from 'moment';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
  timer: 2000
});

interface orderResponse {
  id: any;
  email: any;
  phone: any;
  orderDate: any;
  note: any;
  status: any;
  paymentMethod: any;
  discountPrice: any;
  customer_id: any;
  product_id:any;
  orderdetail_id:any;  
}
declare var require: any;
const jszip: any = require('jszip');
const pdfMake: any = require('pdfmake/build/pdfmake.js');
const pdfFonts: any = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css'],
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

export class OrderTableComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  getid: any;
  id: any;
  orders: any[] = [];
  orderForm: any;
  orderDetailForm: any;
  dtOptions: any = {};
  dtOp:any = {};
  customer: any[] = [];
  product: any[] = [];
  orderdetail: any;
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  customers!: any[];
  selectedOrderId!: any;
  selectedStatus!: 'PENDING';
  orderdetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private oS: OrderService,
    private DS: OrderDetailService,
    private oD: OrderDetailService,
    private route: ActivatedRoute,
    private router: Router,
    private Cs: CustomerService,
    private pS: ProductService,
    public buttonService: ButtonService
  ) 
  {
    this.orderForm = this.formBuilder.group({
      id: [''],
      email: [''],
      phone: [''],
      orderDate: [''],
      note: [''],
      status: [],
      paymentMethod: [''],
      discountPrice: [''],
      customer: this.formBuilder.group({
        id: [""],
      }),
    });
    this.orderDetailForm = this.formBuilder.group({
      id: [''],
      quantity: ['', Validators.required],
      phone: [''],
      email: [''],
      totalPrice: [''],
      productPrice: [''], // Thêm trường này
      customer: this.formBuilder.group({
        id: [""],
      }),
      product: this.formBuilder.group({
        id: [""],
      }),
      address: this.formBuilder.group({
        id: [""],
      }),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.id = params['id'];
        this.oS.getOrderById(this.id).subscribe(
          (response: Object) => {
            this.orderForm.patchValue(response as orderResponse);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
      }
    });

    this.defaultStatus();
    this.refreshTable();
    this.dtOptions = this.getDTOptions();
    
    this.Cs.getCustomer().subscribe((data) => {
      this.customer = data;
    });
    this.pS.getAllProduct().subscribe((data) => {
      this.product = data;
    });

    this.orders.forEach((element: any) => {
      this.oD.getOrderDetailById(this.selectedOrderId).subscribe((data) => {
        this.orderdetail = data;
      });
    });


  }


  onAddress(){

  }

  // getOrder(): any {
  //   this.oS.getOrder().subscribe((orders) => {    
  //       console.log(orders);
  //       if (orders != null && orders.length > 0) {
  //         this.orders =  orders;
  //         // Thêm dữ liệu mới vào mảng chartDate và chartRevenue
  //         for (let o of this.orders) {
  //           o.orderDate =  moment.default(o.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
  //         };
  //       }   
  //   },(error) => {
  //     console.error(error);
  //   });
  // }
  getDTOptions2(): any {
    let dataTables: any = {};
    return dataTables =  {
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
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'excel',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };
  }
  getDTOptions(): any {
    let dataTables: any = {};
    return dataTables =  {
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
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'print',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'excel',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Order',
          exportOptions: {
            columns: ':not(:last-child)', // Ẩn cột cuối cùng
          },
        },
      ],
    };
  }   
  
  defaultStatus() {
    // selected status Active
  // const selectedStatus = 'PROCESSING'; // You can set this based on some condition or user input
  // if (this.selectedStatus === 'PROCESSING' || this.selectedStatus === 'PENDING' || this.selectedStatus === 'DELIVERED' || this.selectedStatus === 'CANCELLED') {
    // this.orderForm.patchValue({
    //   status: this.selectedStatus
    // });
  // } else {
  //   // Handle the case where the selectedStatus is not one of the four options
  // }
  }
  onUpdate(id: number): void {
    this.selectedOrderId = id;
    this.dtOp = this.getDTOptions();
    this.DS.getOrderDetailByOrderId(id).subscribe((data) => {
      this.orderdetails = data;
      console.log('orderdetails:', data);

      if (this.orderdetails && this.orderdetails.length > 0) {
        this.orderDetailForm.get('productPrice').setValue(this.orderdetails[0].product.price);
      }
    })
    this.updateTotalPriceProduct();
  }
  onDetail(id: number): void {
    this.router.navigate(['/orders-detail-table', id]);
    console.log('id:', id);
  }


  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.orders = [];
    this.oS.getOrder().subscribe(
      (newData) => {
        this.orders = newData;
        // for (let o of this.orders) {
        //   o.orderDate =  moment.default(o.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
        // };
        console.log('Dữ liệu mới đã được cập nhật:', this.orders);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }



  fnUpdateOrder() {
    if (this.selectedOrderId) { // Kiểm tra xem selectedOrderId có tồn tại
      const orderinfo = {
        status: this.orderForm.value.status 
      }; 
      this.isSpinning = true;
      this.oS.updateOrderstatus(this.selectedOrderId, orderinfo).subscribe(
        (response) => {
          console.log('Successfully updated Order!');
          this.refreshTable(); // Tải lại dữ liệu sau khi cập nhật thành công
          window.location.reload();
          setTimeout(() => {
            this.isSpinning = false;
            this.orderForm.reset();
            this.defaultStatus();
            Swal.fire({
              icon: 'success',
              title: 'Successfully updated Order!',
              showConfirmButton: false,
              timer: 2000
            })
          }, this.progressTimerOut),window.location.reload();
        },
        (error) => {
          console.error('Failed to update Order:', error);
        }
      );
    } else {
      console.error('Không có id hợp lệ để cập nhật đơn hàng.');
    }
  }


  fnUpdateQuantityOrderDetail() {
    if (this.selectedOrderId) { // Kiểm tra xem selectedOrderId có tồn tại
      const orderdetailinfo = {
        quantity: this.orderDetailForm.value.quantity,
        totalPrice: this.orderDetailForm.value.totalPrice 
      }; 
      this.isSpinning = true;
      this.oD.updateQuantityOrderDetail(this.selectedOrderId, orderdetailinfo).subscribe(
        (response) => {
          console.log('Successfully updated Quantity Order Detail!');
          this.refreshTable(); // Tải lại dữ liệu sau khi cập nhật thành công
          window.location.reload();
          setTimeout(() => {
            this.isSpinning = false;
            this.orderForm.reset();
            this.defaultStatus();
            Swal.fire({
              icon: 'success',
              title: 'Successfully updated Order!',
              showConfirmButton: false,
              timer: 2000
            })
          }, this.progressTimerOut),window.location.reload();
        },
        (error) => {
          console.error('Failed to update Order:', error);
        }
      );
    } else {
      console.error('Không có id hợp lệ để cập nhật đơn hàng.');
    }
  }

  fnDeleteDetailOrder(id: any) {
    const DetailOrderToDelete = this.orderdetails.find((orderdetails: {id: any;}) => orderdetails.id == id);
    if (DetailOrderToDelete) {
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
          this.DS.deleteDetailOrder(id).subscribe(() => {
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
              console.log('Chi tiết đơn hàng đã được xóa thành công');
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
            console.error('Đã xảy ra lỗi khi xóa Chi tiết đơn hàng:', error);
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
        'Detail Order with the specified ID does not exist!',
        'error'
      );
      setTimeout(() => this.isSpinning = false,this.progressTimerOut);
    } 
  }
  getTotalPrice(): any {
    let TotalPrice = 0;
    for (let o of this.orderdetails) {
      TotalPrice += o.totalPrice;
    };
    return TotalPrice;
  }

  updateTotalPriceProduct() {
    const quantity = this.orderDetailForm.get('quantity').value;
    const productPrice = this.orderDetailForm.get('productPrice').value;
  
    // Đảm bảo cả hai giá trị là số trước khi thực hiện tính toán
    if (!isNaN(quantity) && !isNaN(productPrice)) {
      const totalPriceProduct = quantity * productPrice;
      this.orderDetailForm.get('totalPrice').setValue(totalPriceProduct);
    } else {
      console.error('Quantity or product price is not a valid number.');
    }
  }

    getTotalPriceProduct(): any {
    let TotalPriceProduct = 0;
    for (let o of this.orderdetails) {
      TotalPriceProduct += o.product.price * o.quantity;
    };
    return TotalPriceProduct;
  }
  
}
