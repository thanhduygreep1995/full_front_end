import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReportService } from '../service/report/report.service';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.js';
import 'datatables.net-buttons/js/buttons.html5.js';

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
  selector: 'app-top-sold-report',
  templateUrl: './top-sold-report.component.html',
  styleUrls: ['./top-sold-report.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class TopSoldReportComponent{
  data: any;
  product: any;
  isSpinning: boolean = false;
  options: any;
  dtOptions: any = {};
  infoProduct: any[]=[];
  constructor( 
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
    this.rP.getTopSoldReport().subscribe((d) => {
      this.product = d;
      console.log(this.product);
      this.drawChart();
    });

  }


drawChart(): void{
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const categories = this.product.map((item: { model: any; }) => item.model);
  const totalPrices = this.product.map((item: { totalPrice: any; }) => item.totalPrice);
  this.data = {
      labels: categories, 
      datasets: [
          {
              label: 'Total Price(VNĐ)',
              data: totalPrices,
              backgroundColor: ['rgba(255, 159, 64, 0.2)'],
              borderColor: ['rgb(255, 159, 64)'],
              borderWidth: 2
          }
      ]
  };

  this.options = {
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };
}
  formatNumber(price: any) {
    throw new Error('Method not implemented.');
  }

}
