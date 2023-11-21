import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailTableComponent } from './order-detail-table.component';

describe('OrderDetailTableComponent', () => {
  let component: OrderDetailTableComponent;
  let fixture: ComponentFixture<OrderDetailTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailTableComponent]
    });
    fixture = TestBed.createComponent(OrderDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
