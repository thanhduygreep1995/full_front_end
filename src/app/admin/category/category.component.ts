import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReportService } from '../service/report/report.service';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import { Router } from '@angular/router';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class CategoryComponent {
  data: any;
  category: any;
  isSpinning: boolean = false;
  options: any;
  dtOptions: any = {};
  infoCategory: any[]=[];
  constructor( 
    private router: Router,
    private rP: ReportService,
    ) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip', // Hiển thị các nút: buttons, filter, length change, ... (Xem thêm tài liệu DataTables để biết thêm thông tin)
      buttons: [
        {
          extend: 'colvis',
          className: 'btn-primary',
        },

        {
          extend: 'copy',
          title: 'Admin - Product',
        },
        {
          extend: 'print',
          title: 'Admin - Product',
        },
        {
          extend: 'excel',
          title: 'Admin - Product',
        },
        {
          extend: 'csvHtml5',
          title: 'Admin - Product',
        },
        {
          text: 'Top Sold',
          className: 'btn-default',
          action: () => {
            this.onCategory();
          }
        },
      ],
    };
    this.rP.getCategoryQunatityReport().subscribe((d) => {
      this.category = d;
      console.log(this.category);
      this.drawChart();
    });

  }

  onCategory(): void {
    this.router.navigate(['admin/top-sold-report'])
  }

drawChart(): void{
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const categories = this.category.map((item: { name: any; }) => item.name);
  const totalPrices = this.category.map((item: { totalPrice: any; }) => item.totalPrice);
  this.data = {
      labels: categories,
      datasets: [
          {
              label: 'Total Price(VNĐ)',
              data: totalPrices,
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
          }
      ]
  };

  this.options = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: textColor
            }
        }
    },
    layout: {
        padding: {
            left: 5, // Thêm khoảng đệm bên trái
            right: 5 // Thêm khoảng đệm bên phải
        }
    },
    responsive: true, // Cho phép biểu đồ tự động điều chỉnh kích thước
    maintainAspectRatio: false // Loại bỏ tỷ lệ giữa chiều rộng và chiều cao để biểu đồ tự động điều chỉnh kích thước
};

}
  formatNumber(price: any) {
    throw new Error('Method not implemented.');
  }


  getTotalRevenue(): any {
    let totalRevenue = 0;
    for (let b of this.category) {
        totalRevenue += b.totalPrice;
    };
    return totalRevenue;
  }


}
