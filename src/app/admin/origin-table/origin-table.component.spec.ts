import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginTableComponent } from './origin-table.component';

describe('OriginTableComponent', () => {
  let component: OriginTableComponent;
  let fixture: ComponentFixture<OriginTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OriginTableComponent]
    });
    fixture = TestBed.createComponent(OriginTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
