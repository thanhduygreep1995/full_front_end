import { ReportService } from './../service/report/report.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import 'datatables.net-bs4';
import 'datatables.net-select-bs4';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { forkJoin } from 'rxjs';
declare var Chart: any;

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

enum Status {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED'
}

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class CustomerReportComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;

  dtElement!: DataTableDirective;
  CustomerReports: any[] = [];
  infoCustomerReport: any;
  dtOptions: any = {};
  isSpinning: boolean = false;
  isLine: boolean = false;
  isPie: boolean = false;
  isPieS: boolean = false;
  progressTimerOut: number = 1200;
  countBuyings: number = 0 ;
  countNoneBuyings: number = 0 ;
  lineChart: any;
  pieChart: any;
  chartRevenue: any [] = [];
  chartCustomerLabels: any;
  countActive: any;
  countLocked: any;
  pieSChart: any;


  constructor(private formBuilder: FormBuilder, 
    private report: ReportService,
    ) {
      this.dtOptions = this.getDTOptions();
  }

  ngOnInit(): void {
    this.dtOptions = this.getDTOptions();
    this.getAllCustomerReport();
    this.isPie = true;
  }

  getDTOptions(): any {
    let dataTables: any = {};
    return dataTables = {
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
          text: 'Buying',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) => {      
            // this.chartDate = [];
            // this.chartRevenue = [];
            this.CustomerReports = [];
            this.onBuyingButtonClick();
            Toast.fire({
              icon: 'success',
              title: "Data changed successfully"
            })
          }
        },
        {
          text: 'None Buying',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) => {      
            this.CustomerReports = [];
            this.onNoneBuyingButtonClick();
            Toast.fire({
              icon: 'success',
              title: "Data changed successfully"
            })
          }
        },
        {
          text: 'Reset',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) =>{
            // this.chartDate = [];
            // this.chartRevenue = [];
            this.CustomerReports = [];
            this.onResetButtonClick();
            Toast.fire({
              icon: 'success',
              title: "Data changed successfully"
            })
          }
        },
        {
          extend: 'copy',
          title: 'Admin - Income Report',
          footer: true,
          action: (e: any, dt: any, node: any, config: any) => {
            let dataToCopy: string[] = [];
            let I : number;
            // Thêm tiêu đề
            dataToCopy.push('Admin - Customers Report');
            dataToCopy.push('No  Full Name  Revenue  Email  Phone  Birthday  Day Created  Status');
        
            // Thêm dữ liệu từ CustomerReports vào mảng dataToCopy
            this.CustomerReports.forEach((item, index) => {
              const dateCreated = moment.default(item.day_created);
              const formattedDate: string = dateCreated.format('DD/MM/YYYY');

              const bDateCreated = moment.default(item.birth_date);
              const bFormattedDate: string = bDateCreated.format('DD/MM/YYYY');
              I = index + 1;
              dataToCopy.push(`${index + 1}  ${item.name}   ${item.revenue}   ${item.email}
                 ${item.phone}   ${bFormattedDate}   ${formattedDate}   ${item.status}`);
              
            });
            // dataToCopy.push('Total Revenue  ' + this.getTotalRevenue());
            // Gộp mảng thành một chuỗi với dấu xuống dòng
            const copiedData = dataToCopy.join('\n');
        
            // Sao chép dữ liệu vào Clipboard
            navigator.clipboard.writeText(copiedData)
              .then(() => {
                Toast.fire({
                  icon: 'success',
                  title: I + " rows have been copied"
                })
                console.log('Đã sao chép thành công:', copiedData);
              })
              .catch((error) => {
                console.error('Sao chép thất bại:', error);
              });
           
          }
        },
        {
          extend: 'print',
          title: 'Admin - Income Report',
          footer: true,
          customize: (win: any) => {
            $(win.document.body).prepend('<h1>Report Customers</h1>');        
            $(win.document.body).find('table').replaceWith(this.updateTableData());
          }
        }
        ,
        {
          text: 'Excel',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) =>{
            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('Income Report');
            
            // Merge hàng cho tiêu đề
            worksheet.mergeCells('A1:H1');
           // Thiết lập tiêu đề cho Excel
            worksheet.getCell('A1').value = 'Customer Report';
            worksheet.getCell('A1').font = { size: 20, bold: true, };
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
            worksheet.getRow(2).values = ['No', 'Full Name', 'Revenue',
             'Email', 'Phone', 'Birthday', 'Day Created', 'Status'];

            this.CustomerReports.forEach((item, index) => {
              const dateCreated = moment.default(item.day_created);
              const formattedDate: string = dateCreated.format('DD/MM/YYYY');

              const bDateCreated = moment.default(item.birth_date);
              const bFormattedDate: string = bDateCreated.format('DD/MM/YYYY');
              worksheet.addRow([index + 1 , item.name, item.revenue,
                 item.email, item.phone, bFormattedDate, formattedDate, item.status]);
            });
            // const totalRevenueRow = this.CustomerReports.length + 3;
            // worksheet.mergeCells(`A${totalRevenueRow}:C${totalRevenueRow}`);
            // worksheet.getCell(`A${totalRevenueRow}`).value = 'Total Revenue';
            // worksheet.getCell(`A${totalRevenueRow}`).alignment = { vertical: 'middle', horizontal: 'center' }
            


            // Thiết lập dữ liệu dọc (vertical) cho ô cột Total Revenue
            // worksheet.getCell(`D${totalRevenueRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
            
            // Set column widths (optional)
            worksheet.columns.forEach((column, index) => {
              column.width = 15;
            });
          
            // Generate Excel file and save it
            workbook.xlsx.writeBuffer().then((buffer: any) => {
              
              const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              saveAs(blob, 'CustomerReport.xlsx'); // You can use FileSaver.js to save the file
            });
          }
        },
        {
          text: 'CSV',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) => {
            // const totalRevenue = this.getTotalRevenue();
            // Thêm tiêu đề cho các cột
            const csvData: any[] = [['Customer Report']];

            csvData.push(['No', 'Full Name', 'Revenue',
            'Email', 'Phone', 'Birthday', 'Day Created', 'Status']);
            // Thêm dữ liệu vào mảng CSV
            this.CustomerReports.forEach((item, index) => {
              const dateCreated = moment.default(item.day_created);
              const formattedDate: string = dateCreated.format('DD/MM/YYYY');
  
              const bDateCreated = moment.default(item.birth_date);
              const bFormattedDate: string = bDateCreated.format('DD/MM/YYYY');
              csvData.push([index + 1 , item.name, item.revenue,
                item.email, item.phone, bFormattedDate, formattedDate, item.status]);
            });

            // Thêm dòng tổng tiền vào mảng CSV

            // csvData.push(['', '', 'Total Revenue', totalRevenue]);

            // Chuyển đổi mảng thành chuỗi CSV
            const csvString = csvData.map(row => row.join(',')).join('\n');

            // Tạo Blob từ chuỗi CSV
            const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

            // Tạo URL cho Blob và tạo một thẻ a để tải xuống
            const csvUrl = URL.createObjectURL(csvBlob);
            const anchor = document.createElement('a');
            anchor.href = csvUrl;
            anchor.download = 'CustomerReport.csv';
            anchor.click();

            // Giải phóng URL và Blob để tránh rò rỉ bộ nhớ
            URL.revokeObjectURL(csvUrl);
          }
        },
      ],
    };
  }

  onBuyingButtonClick(): void {
    this.chartCustomerLabels = [];
    this.chartRevenue = [];
    this.countBuyings = 0;
    this.countNoneBuyings = 0;
    this.getBuyingCustomerReport();
    this.isLine = true;
    this.isPie = false;
    this.isPieS = false;
  }
  
  onNoneBuyingButtonClick(): void {
    this.chartCustomerLabels = [];
    this.chartRevenue = [];
    this.countBuyings = 0;
    this.countNoneBuyings = 0;
    this.getNoneBuyingCustomerReport();
    this.isLine = false;
    this.isPie = false;
    this.isPieS = true;
  }
  
  onResetButtonClick(): void {
    this.chartCustomerLabels = [];
    this.chartRevenue = [];
    this.countBuyings = 0;
    this.countNoneBuyings = 0;
    this.getAllCustomerReport();
    this.isLine = false;
    this.isPieS = false;
    this.isPie = true;
  }
  
  getAllCustomerReport(): any {
    if (this.lineChart) {
      this.lineChart.destroy(); // Hủy biểu đồ cũ nếu đã được vẽ trước đó
    }
    this.report.getAllCustomerReport().subscribe(report => {    
        console.log(report);
       
        if (report != null && Array.isArray(report) && report.length > 0) {
          // Thêm dữ liệu mới vào mảng chartDate và chartRevenue
          // this.chartDate.splice(0, this.chartDate.length);
          // this.chartRevenue.splice(0, this.chartRevenue.length);
          this.CustomerReports = report;
          for (let b of this.CustomerReports) {
            // b.birth_date =  moment.default(b.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            // b.day_created =  moment.default(b.day_created, 'YYYY-MM-DD').format('DD/MM/YYYY');
            if (b.revenue == 0) {
              this.countNoneBuyings++;
            }else{
              this.countBuyings++;
            }
            // this.chartDate.push(b.date);

            // this.chartOrder.push(b.orders);
          };
          console.log("countBuyings: " + this.countBuyings);
          console.log("countNoneBuyings: " + this.countNoneBuyings);
          this.drawPieChart();
        }   
    },(error) => {
      console.error(error);
      Toast.fire({
        icon: 'error',
        title: "Data changed failed"
      })
    });
  }

  updateTableData(): string {
    let tableData: string = '<table class="table table-bordered table-striped row-border hover">' +
      '<thead>' +
      '<tr>' +
      '<th>No</th>' +
      '<th>Full Name</th>' +
      '<th>Revenue</th>' +
      '<th>Email</th>' +

      '<th>Phone</th>' +
      '<th>Birthday</th>' +
      '<th>Day Created</th>' +
      '<th>Status</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

  
      tableData += this.CustomerReports.map((item, index) => {
        const dateCreated = moment.default(item.day_created);
        const formattedDate: string = dateCreated.format('DD/MM/YYYY');

        const bDateCreated = moment.default(item.birth_date);
        const bFormattedDate: string = bDateCreated.format('DD/MM/YYYY');
        return '<tr>' +
          '<td>' + (index + 1) + '</td>' +
          '<td>' + item.name + '</td>' +
          '<td>' + item.revenue + '</td>' +
          '<td>' + item.email + '</td>' +
          '<td>' + item.phone + '</td>' +
          '<td>' + bFormattedDate + '</td>' +
          '<td>' + formattedDate+ '</td>' +
          '<td>' + item.status + '</td>' +
          '</tr>';
      }).join('');
  
    tableData += '</tbody>' +
                  '</table>';
  
    return tableData;
  }

  drawPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if(this.lineChart) {
      this.lineChart.destroy();
    }
    if(this.pieSChart) {
      this.pieSChart.destroy();
    }
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Customer used to buy', 'Customer did not buy anything'], // Thay thế bằng các nhãn của bạn
        datasets: [{
          data: [this.countBuyings, this.countNoneBuyings], // Thay thế bằng dữ liệu của bạn
          backgroundColor: ['#007bff', '#28a745'], // Màu nền của các phần tử trong biểu đồ
          borderColor: '#ffffff' // Màu viền của các phần tử trong biểu đồ
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  drawPieStatusChart(): void {
    const ctx = document.getElementById('pieSChart') as HTMLCanvasElement;
    if(this.lineChart) {
      this.lineChart.destroy();
    }
    if(this.pieChart) {
      this.pieChart.destroy();
    }
    this.pieSChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['ACTIVE', 'LOCKED'], // Thay thế bằng các nhãn của bạn
        datasets: [{
          data: [this.countActive, this.countLocked], // Thay thế bằng dữ liệu của bạn
          backgroundColor: ['#007bff', '#28a745'], // Màu nền của các phần tử trong biểu đồ
          borderColor: '#ffffff' // Màu viền của các phần tử trong biểu đồ
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  drawChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if(this.pieChart) {
      this.pieChart.destroy();
    }
    if(this.pieSChart) {
      this.pieSChart.destroy();
    }
    this.lineChart = new Chart(ctx, {
      type: 'bar', // Corrected chart type to 'bar'
      data: {
        labels: this.chartCustomerLabels,
        datasets: [
          {
            label: 'Revenue',
            data: this.chartRevenue,
            backgroundColor: "#FD3D57",
            borderColor: "#36A2EB",
            borderWidth: 1,
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Revenue',
              },
            }
          ]
        }
      }
    });
  }


  getBuyingCustomerReport(): any {
    return this.report.getBuyingCustomerReport().subscribe(
      (report) => {
        console.log(report);
        if (report != null && Array.isArray(report) && report.length > 0) {
          this.CustomerReports = report;   
          for (let b of this.CustomerReports) {
            // b.birth_date =  moment.default(b.birth_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
            // b.day_created =  moment.default(b.day_created, 'YYYY-MM-DD').format('DD-MM-YYYY');
            this.chartCustomerLabels.push(b.name);
            this.chartRevenue.push(b.revenue);
          };
          Toast.fire({
            icon: 'success',
            title: "Data changed successfully"
          })
          this.drawChart();
        } 
      },
      (error) => {
        console.error(error);
        Toast.fire({
          icon: 'error',
          title: "Data changed failed"
        })
      }
    );
  }

  getNoneBuyingCustomerReport(): any {
    forkJoin([
      this.report.getNoneBuyingCustomerReport(),
      this.report.getStatus()
    ]).subscribe(([report, status]: [any, any]) => {
      console.log(report);
      console.log(status);
  
      if (report != null && Array.isArray(report) && report.length > 0) {
        this.CustomerReports = report;
        this.countActive = 0;
        this.countLocked = 0;
  
        for (let b of this.CustomerReports) {
          // b.birth_date = moment.default(b.birth_date, 'YYYY-MM-DD').format('DD-MM-YYYY');
          // b.day_created = moment.default(b.day_created, 'YYYY-MM-DD').format('DD-MM-YYYY');
  
          if (b.status == status) {
            this.countActive++;
          } else {
            this.countLocked++;
          }
        }
  
        console.log("Active: " + this.countActive);
        console.log("Locked: " + this.countLocked);
  
        Toast.fire({
          icon: 'success',
          title: "Data changed successfully"
        });
  
        this.drawPieStatusChart();
      }
    }, (error) => {
      console.error(error);
      Toast.fire({
        icon: 'error',
        title: "Data changed failed"
      });
    });
  }

 

}
