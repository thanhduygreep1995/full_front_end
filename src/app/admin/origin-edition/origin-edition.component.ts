import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OriginService } from '../service/origin/origin.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ButtonService } from '../service/button/buttonservice';

interface OriginResponse {
  id: any;
  country: any;
}

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-danger mx-3',
    cancelButton: 'btn btn-success',
  },
  buttonsStyling: false,
})

@Component({
  selector: 'app-origin-edition',
  templateUrl: './origin-edition.component.html',
  styleUrls: ['./origin-edition.component.css'],
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
export class OriginEditionComponent implements OnInit {
  id: any;
  infoOrigin: FormGroup;

  ButtonSave: boolean = true;
  ButtonUpdate: boolean = true;
  isSpinning: boolean = false;
  progressTimerOut: number = 1200;
  origins: any;

  constructor(
    private formBuilder: FormBuilder,
    private oS: OriginService,
    private route: ActivatedRoute,
    private router: Router,
    public buttonService: ButtonService

  ) {
    this.infoOrigin = this.formBuilder.group({
      id: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.infoOrigin.valueChanges.subscribe(() => {
      this.ButtonSave = this.infoOrigin.controls['country'].invalid;
    });
    this.infoOrigin.valueChanges.subscribe(() => {
      this.ButtonUpdate = this.infoOrigin.invalid;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.id = params['id'];
        this.oS.getOriginById(this.id).subscribe(
          (response: Object) => {
            this.infoOrigin.patchValue(response as OriginResponse);
          },
          (error) => {
            console.log(error);
            // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
          }
        );
      } else {
        // Xử lý trường hợp không tìm thấy `id`, ví dụ chuyển hướng người dùng đến trang khác hoặc hiển thị thông báo lỗi
      }
    });
    this.refreshTable();
  }

  fnAddOrigin() {
    const originInfo = {
      country: this.infoOrigin.value.country,
    };
    this.isSpinning = true;
    this.oS.createOrigin(originInfo).subscribe(
      (response) => {
        setTimeout(() => {
          this.isSpinning = false;
          console.log('Successfully Create Origin!');
          this.router.navigate(['/origin-table']);
          this.infoOrigin.reset();
          Swal.fire({
            icon: 'success',
            title: 'Successfully Create Origin!',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
      },
      (error) => {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Your work has not been saved',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
        console.error('Failed to Create Origin:', error);
      }
    );
  }

  fnUpdateOrigin() {
    const originInfo = {
      country: this.infoOrigin.value.country,
    };

    this.oS.updateOrigin(this.id, originInfo).subscribe(
      (response) => {
        console.log('Successfully updated Origin!');
        setTimeout(() => {
          this.isSpinning = false;
          console.log('Successfully updated Origin!');
          window.location.reload();
          this.infoOrigin.reset();
          Swal.fire({
            icon: 'success',
            title: 'Successfully updated Origin!',
            showConfirmButton: false,
            timer: 2000
          })
        }, this.progressTimerOut);
      },
      (error) => {
        setTimeout(() => {
          this.isSpinning = false;
          Swal.fire({
            icon: 'error',
            title: 'Your work has not been updated',
            showConfirmButton: false,
            timer: 2000
          });
        }, this.progressTimerOut);
        console.error('Failed to update Origin:', error);
      }
    );
  }
  refreshTable() {
    // Gọi API hoặc thực hiện các thao tác khác để lấy lại dữ liệu mới
    this.oS.getAllOrigins().subscribe(
      (newData) => {
        this.origins = newData;
        console.log('Dữ liệu mới đã được cập nhật:', this.origins);
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu mới:', error);
      }
    );
  }
}
