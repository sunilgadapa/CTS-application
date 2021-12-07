import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualValidationComponent } from './manual-validation.component';

describe('ManualValidationComponent', () => {
  let component: ManualValidationComponent;
  let fixture: ComponentFixture<ManualValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
