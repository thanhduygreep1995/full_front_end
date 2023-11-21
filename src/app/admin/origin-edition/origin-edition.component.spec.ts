import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginEditionComponent } from './origin-edition.component';

describe('OriginEditionComponent', () => {
  let component: OriginEditionComponent;
  let fixture: ComponentFixture<OriginEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OriginEditionComponent]
    });
    fixture = TestBed.createComponent(OriginEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
