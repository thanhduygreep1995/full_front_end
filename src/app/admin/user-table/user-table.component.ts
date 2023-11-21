import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder } from '@angular/forms';
import { CustomerService } from '../service/customer/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../service/role/role.service';
import * as moment from 'moment';


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

interface orderdetailResponse {
  id: any;
  firstName: any;
  lastName : any;
  dateOfBirth: any;
  email: any;
  phoneNumber: any;
  createDate: any;
  status: any;
  role: any;
}
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
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
export class UserTableComponent implements OnInit {
  // Must be declared as "any", not as "DataTables.Settings"
  id: any;
  customers: any[] = [];
  roles:any;
  customerForm: any;
  dtOptions: any = {};
  data: any[] = []; // Mảng dữ liệu cho DataTables
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  selectedStatus!: any;
  selectedRole!: any;
  selectedCustomerId!: any;
  dateofBirth: any;
  createDate: any;
  constructor(
    private formBuilder: FormBuilder,
    private cS: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private rS: RoleService
  ) 
  {
    this.customerForm = this.formBuilder.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      email: [''],
      phoneNumber: [''],
      createDate: [''],
      status: [''],
      role: [''],
    });
  }

ngOnInit(): void {
  // Chuỗi JSON từ yêu cầu của bạn
  this.route.params.subscribe((params) => {
    if (params && params['id']) {
      this.id = params['id'];
      this.cS.getCustomerById(this.id).subscribe(
        (response: Object) => {
          this.customerForm.patchValue(response as orderdetailResponse);
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
  this.getCustomer();
  this.rS.getRole().subscribe((data) => {
    this.roles = data;
  });
  
}
getCustomer(): any {
  this.cS.getCustomer().subscribe((customers) => {    
      console.log(customers);
      if (customers != null && Array.isArray(customers) && customers.length > 0) {
        this.customers =  customers;
        // Thêm dữ liệu mới vào mảng chartDate và chartRevenue
        for (let c of this.customers) {
          c.createDate =  moment.default(c.createDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
          c.dateOfBirth =  moment.default(c.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY');
        };
      }   
  },(error) => {
    console.error(error);
  });
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

}
onUpdate(id: number): void {
  this.selectedCustomerId = id;
}

refreshTable() {
  // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
  this.cS.getCustomer().subscribe(
    (newData) => {
      this.customers = newData;
      console.log('Dữ liệu mới đã được cập nhật:', this.customers);
    },
    (error) => {
      console.error('Lỗi khi lấy dữ liệu mới:', error);
    }
  );
}
fnUpdateCustomer() {
  if (this.selectedCustomerId) { // Kiểm tra xem selectedOrderId có tồn tại
    const customerinfo = {
      status: this.customerForm.value.status,
      role_id: this.selectedRole
    }; 
    this.isSpinning = true;
    this.cS.updateCustomerstatus(this.selectedCustomerId, customerinfo).subscribe(
      (response) => {
        console.log('Successfully updated Order!');
        this.refreshTable(); // Tải lại dữ liệu sau khi cập nhật thành công
        setTimeout(() => {
          this.isSpinning = false;
          this.customerForm.reset();
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
}
