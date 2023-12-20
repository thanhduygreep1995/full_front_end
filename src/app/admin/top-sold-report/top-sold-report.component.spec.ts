import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSoldReportComponent } from './top-sold-report.component';

describe('TopSoldReportComponent', () => {
  let component: TopSoldReportComponent;
  let fixture: ComponentFixture<TopSoldReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopSoldReportComponent]
    });
    fixture = TestBed.createComponent(TopSoldReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
