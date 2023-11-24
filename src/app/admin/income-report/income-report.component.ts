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

@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Ẩn khi khởi tạo
      transition('void => *', animate('300ms')), // Hiển thị trong 200ms khi được thêm vào DOM
    ]),
  ]
})
export class IncomeReportComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(DataTableDirective, { static: false })

  dtElement!: DataTableDirective;
  IncomeReports: any[] = [];
  infoIncomeReport: any;
  dtOptions: any = {};
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  fromDate: any;
  toDate: any;
  tfoot: any[] = [];
  chartDate: any[] = [];
  chartRevenue: any[] = [];
  chartOrder: any[] = [];
  lineChart: any;


  constructor(private formBuilder: FormBuilder, 
    private report: ReportService,
    ) {
      this.dtOptions = this.getDTOptions();
  }

  ngOnInit(): void {
    this.dtOptions = this.getDTOptions();
    this.getDefaultIncomeReport();
  }

  getDTOptions(): any {
    let dataTables: any = {};
    return dataTables = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip', // Hiển thị các nút: buttons, filter, length change, ... (Xem thêm tài liệu DataTables để biết thêm thông tin)
      columnDefs: [
        {
          targets: 0, // Cột thứ hai (index 1) trong dữ liệu đầu vào
          render: function (data: any, type: any, row: any, meta: { row: number; }) {
            return meta.row + 1;
          },
        },
        {
          targets: 1, // Cột thứ nhất (index 0) trong dữ liệu đầu vào
          data: 'date', // Thuộc tính trong đối tượng dữ liệu
        },
        {
          targets: 2, // Cột thứ hai (index 1) trong dữ liệu đầu vào
          data: 'orders', // Thuộc tính trong đối tượng dữ liệu
        },
        {
          targets: 3, // Cột thứ ba (index 2) trong dữ liệu đầu vào
          data: 'revenue', // Thuộc tính trong đối tượng dữ liệu
        },
      ],
      buttons: [
        {
          extend: 'colvis',
          className: 'btn-primary',
          columns: ':not(:last-child)',
        },
        {
          text: 'Date',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) => {      
            Swal.fire({
              title: 'Pick a Date',
              html: `
                From<input type="date" id="from" class="swal2-input ml-4"><br>
                To<input type="date" id="to" class="swal2-input ml-5">
              `,
              customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
              },
              showCancelButton: true,
              preConfirm: () => {
                const fromD = (document.getElementById('from') as HTMLInputElement).value;
                const toD= (document.getElementById('to') as HTMLInputElement).value;
                // Xử lý logic khi người dùng chọn ngày ở đây
    
                const inputFDate = new Date(fromD).toLocaleString('en-GB', 
                  { year: 'numeric', month: '2-digit',
                   day: '2-digit'});
                const inputTDate = new Date(toD).toLocaleString('en-GB', 
                  { year: 'numeric', month: '2-digit',
                   day: '2-digit'});
                const formattedFromDate = moment.default(inputFDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
                
                const formattedToDate = moment.default(inputTDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
                this.fromDate = formattedFromDate;
                this.toDate = formattedToDate;

                console.log('From Date:', this.fromDate);
                console.log('To Date:', this.toDate);
                // Chuyển đổi hàm API thành Observable
                this.chartDate = [];
                this.IncomeReports = [];
                this.chartRevenue = [];
                this.getIncomeReportByDate();
              }
            });
          }
        },
        {
          text: 'Reset',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) =>{
            this.chartDate = [];
            this.IncomeReports = [];
            this.chartRevenue = [];
            this.getDefaultIncomeReport();
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
            dataToCopy.push('Admin - Income Report');
            dataToCopy.push('No  Date  Orders Time  Revenue');
        
            // Thêm dữ liệu từ IncomeReports vào mảng dataToCopy
            this.IncomeReports.forEach((item, index) => {
              I = index + 1;
              dataToCopy.push(`${index + 1}  ${item.date}   ${item.orders}   ${item.revenue}`);
              
            });
            dataToCopy.push('Total Revenue  ' + this.getTotalRevenue());
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
            $(win.document.body).prepend('<h1>Report By Date</h1>');        
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
            worksheet.mergeCells('A1:D1');
           // Thiết lập tiêu đề cho Excel
            worksheet.getCell('A1').value = 'Income Report';
            worksheet.getCell('A1').font = { size: 20, bold: true, };
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
            worksheet.getRow(2).values = ['No', 'Date', 'Orders Time', 'Revenue'];

            this.IncomeReports.forEach((item, index) => {
              
              worksheet.addRow([index + 1 , item.date, item.orders, item.revenue]);
            });
            const totalRevenueRow = this.IncomeReports.length + 3;
            worksheet.mergeCells(`A${totalRevenueRow}:C${totalRevenueRow}`);
            worksheet.getCell(`A${totalRevenueRow}`).value = 'Total Revenue';
            worksheet.getCell(`A${totalRevenueRow}`).alignment = { vertical: 'middle', horizontal: 'center' }
            
            // Thêm giá trị của getTotalRevenue() vào ô tương ứng
            worksheet.getCell(`D${totalRevenueRow}`).value = this.getTotalRevenue();
            // Thiết lập dữ liệu dọc (vertical) cho ô cột Total Revenue
            worksheet.getCell(`D${totalRevenueRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
            
            // Set column widths (optional)
            worksheet.columns.forEach((column, index) => {
              column.width = 15;
            });
          
            // Generate Excel file and save it
            workbook.xlsx.writeBuffer().then((buffer: any) => {
              
              const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              saveAs(blob, 'IncomeReport.xlsx'); // You can use FileSaver.js to save the file
            });
          }
        },
        {
          text: 'CSV',
          className: 'btn-default',
          action: (e: any, dt: any, node: any, config: any) => {
            const totalRevenue = this.getTotalRevenue();
            // Thêm tiêu đề cho các cột
            const csvData: any[] = [['Income Report']];
            csvData.push(['No', 'Date', 'Orders Time', 'Revenue']);
            // Thêm dữ liệu vào mảng CSV
            this.IncomeReports.forEach((item, index) => {
              csvData.push([index + 1, item.date, item.orders, item.revenue]);
            });

            // Thêm dòng tổng tiền vào mảng CSV

            csvData.push(['', '', 'Total Revenue', totalRevenue]);

            // Chuyển đổi mảng thành chuỗi CSV
            const csvString = csvData.map(row => row.join(',')).join('\n');

            // Tạo Blob từ chuỗi CSV
            const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

            // Tạo URL cho Blob và tạo một thẻ a để tải xuống
            const csvUrl = URL.createObjectURL(csvBlob);
            const anchor = document.createElement('a');
            anchor.href = csvUrl;
            anchor.download = 'IncomeReport.csv';
            anchor.click();

            // Giải phóng URL và Blob để tránh rò rỉ bộ nhớ
            URL.revokeObjectURL(csvUrl);
          }
        },
      ],
      footerCallback: this.footerCallback.bind(this),
    };
  }
  
  getDefaultIncomeReport(): any {
    this.report.getDefaultIncomeReport().subscribe(report => {    
        console.log(report);
       
        if (report != null && Array.isArray(report) && report.length > 0) {
          // Thêm dữ liệu mới vào mảng chartDate và chartRevenue
          this.chartDate.splice(0, this.chartDate.length);
          this.chartRevenue.splice(0, this.chartRevenue.length);
          this.IncomeReports = report;
          for (let b of this.IncomeReports) {
            // b.date =  moment.default(b.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            this.chartDate.push(b.date);
            this.chartRevenue.push(b.revenue);
            this.chartOrder.push(b.orders);
          };
          this.drawChart();
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
      '<th>Date</th>' +
      '<th>Orders Time</th>' +
      '<th>Revenue</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';
  
    tableData += this.IncomeReports.map((item, index) => {
      return '<tr>' +
        '<td>' + (index + 1) + '</td>' +
        '<td>' + item.date + '</td>' +
        '<td>' + item.orders + '</td>' +
        '<td>' + item.revenue + '</td>' +
        '</tr>';
    }).join('');
  
    tableData += '</tbody>' +
                ` <tfoot>
                    <tr >                 
                      <th colSpan="3" class="text-center print-hide">Total Revenue</th>
                      <th class="text-center">`+this.getTotalRevenue()+`</th>
                    </tr>
                  </tfoot>` +
                  '</table>';
  
    return tableData;
  }


  drawChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (this.lineChart) {
      this.lineChart.destroy(); // Hủy biểu đồ cũ nếu đã được vẽ trước đó
    }
    const formattedDates = this.chartDate.map((date) => moment.default(date).format('DD/MM/YYYY'));
    console.log('Chart Dates:', this.chartDate);
    console.log('Chart Revenue:', this.chartRevenue);
    this.lineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: formattedDates,
        datasets: [
          // Dataset cho bar chart
          {
            label: 'Order Times',
            data: this.chartOrder,
            
            borderColor: "#36A2EB",
            tension: 0.1,
            fill: false,
            type: 'line', // Chỉ định loại dữ liệu là line chart
            yAxisID: 'y1',
          },
          // Dataset cho line chart
          {
            label: 'Revenue',
            data: this.chartRevenue,
            borderColor: "#36A2EB",
            fill: 0.1,
            backgroundColor: "#FD3D57",
            yAxisID: 'y',
          }
        ]
      },
      options: {
        scales: {

          yAxes: [
            {
              id: 'y',
              type: 'linear',
              position: 'left',
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true, // Hiển thị lưới trên trục y
                drawOnChartArea: false, // Không vẽ lưới trên biểu đồ để tránh overlap
              },  
              scaleLabel: {
                display: true,
                labelString: 'Revenue of each day', // Đặt tiêu đề cho trục y
              },
            },
            {
              id: 'y1',
              type: 'linear',
              position: 'right',
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
                drawOnChartArea: false,
              }, 
              scaleLabel: {
                display: true,
                labelString: 'Orders Time Of Each Day', // Đặt tiêu đề cho trục y
              },
            },
          ],
          
        }
      }
    });
  }


  getIncomeReportByDate(): any {
    return this.report.getIncomeReportByDay(this.fromDate, this.toDate).subscribe(
      (report) => {
        console.log(report);
        if (report != null && Array.isArray(report) && report.length > 0) {
          // Thêm dữ liệu mới vào mảng chartDate và chartRevenue
          this.chartDate.splice(0, this.chartDate.length);
          this.chartRevenue.splice(0, this.chartRevenue.length);   
          this.IncomeReports = report;   
          for (let b of this.IncomeReports) {
            // b.date =  moment.default(b.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            this.chartDate.push(b.date);
            this.chartRevenue.push(b.revenue);
            this.chartOrder.push(b.orders);
          };
          Toast.fire({
            icon: 'success',
            title: "Data changed successfully"
          })
          this.drawChart();
        } else {
          this.getDefaultIncomeReport();
          Toast.fire({
            icon: 'info',
            title: "No Data Exists At That Time"
          })
        } 
        // this.initializeDataTable(report);
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

  getTotalRevenue(): any {
    let totalRevenue = 0;
    for (let b of this.IncomeReports) {
        totalRevenue += b.revenue;
    };
    return totalRevenue;
  }


  footerCallback(tfoot: Node, data: any[], start: number, end: number, display: any): void {
    // Tính tổng cột 'revenue'

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      const footerColumn = dtInstance.column(2);
      const footerNode = footerColumn.footer();
      
      // Loại bỏ lớp d-none
      footerNode.classList.remove('d-none');
      
      // Thiết lập giá trị colspan
      if (footerNode instanceof HTMLElement) {
        footerNode.setAttribute('colspan', '3');
      }
    
      // // Thiết lập nội dung cho footer
      footerNode.innerHTML = 'Total Revenue';     
    });

  }
}
