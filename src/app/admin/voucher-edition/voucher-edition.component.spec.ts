import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherEditionComponent } from './voucher-edition.component';

describe('VoucherEditionComponent', () => {
  let component: VoucherEditionComponent;
  let fixture: ComponentFixture<VoucherEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherEditionComponent]
    });
    fixture = TestBed.createComponent(VoucherEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
