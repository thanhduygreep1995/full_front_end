import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsEditionComponent } from './specifications-edition.component';

describe('SpecificationsEditionComponent', () => {
  let component: SpecificationsEditionComponent;
  let fixture: ComponentFixture<SpecificationsEditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsEditionComponent]
    });
    fixture = TestBed.createComponent(SpecificationsEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
