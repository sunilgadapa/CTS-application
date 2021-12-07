import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasManualDataloadValidationComponent } from './pas-manual-dataload-validation.component';

describe('PasManualDataloadValidationComponent', () => {
  let component: PasManualDataloadValidationComponent;
  let fixture: ComponentFixture<PasManualDataloadValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasManualDataloadValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasManualDataloadValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
