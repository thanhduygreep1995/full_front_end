import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder } from '@angular/forms';
import { OrderDetailService } from '../service/orderdetail/orderdetail/orderdetail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product/product.service';
import { OrderService } from '../service/order/order.service';
import Swal from 'sweetalert2';


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
  timer: 2000
});

interface orderdetailResponse {
  id: any;
  quantity: any;
  totalPrice: any;
  order_id: any;
  product_id: any;
}
declare var require: any;
const jszip: any = require('jszip');
const pdfMake: any = require('pdfmake/build/pdfmake.js');
const pdfFonts: any = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order-detail-table',
  templateUrl: './order-detail-table.component.html',
  styleUrls: ['./order-detail-table.component.css'],
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
export class OrderDetailTableComponent implements OnInit{
  id: any;
  orderdetails: any;
  orderdetailForm: any;
  dtOptions: any = {};
  product: any;
  order: any;
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  products!: any[];
  orders!: any[];
  selectedOrderId!: number;
  constructor(
    private formBuilder: FormBuilder,
    private DS: OrderDetailService,
    private route: ActivatedRoute,
    private router: Router,
    private pS: ProductService,
    public oS: OrderService
  ) 
  {
    this.orderdetailForm = this.formBuilder.group({
      id: [''],
      quantity: [''],
      totalPrice: [''],
      order_id: [''],
      product_id: [''],
    });
  }

ngOnInit(): void {
  // Chuỗi JSON từ yêu cầu của bạn
  this.route.params.subscribe((params) => {
    if (params && params['id']) {
      this.id = params['id'];
      this.DS.getOrderDetailById(this.id).subscribe(
        (response: Object) => {
          this.orderdetailForm.patchValue(response as orderdetailResponse);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
    }
  });

  this.refreshTable();
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
        title: 'Admin -  Order Detail',
        exportOptions: {
          columns: ':not(:last-child)', // Ẩn cột cuối cùng
        },
      },
      {
        extend: 'print',
        title: 'Admin -  Order Detail',
        exportOptions: {
          columns: ':not(:last-child)', // Ẩn cột cuối cùng
        },
      },
      {
        extend: 'excel',
        title: 'Admin - Order Detail',
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
  this.DS.getOrderDetail().subscribe((data) => {
    console.log(data);
    this.orderdetails = data.map((order, index) =>({...order, index: index + 1}));
  });
  this.oS.getOrder().subscribe((data) => {
    console.log(data);
    this.order = data;
  });
  this.pS.getAllProduct().subscribe((data) => {
    this.product = data;
  });

  this.DS.getOrderDetailByOrderId(this.id).subscribe((data) => {
    this.orderdetails = data;
  })
  
}

refreshTable() {
  // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
  this.DS.getOrderDetail().subscribe(
    (newData) => {
      this.orderdetails = newData;
      console.log('Dữ liệu mới đã được cập nhật:', this.orderdetails);
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu mới:', error);
    }
  );
}
}


