import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarsValidationComponent } from './sars-validation.component';

describe('SarsValidationComponent', () => {
  let component: SarsValidationComponent;
  let fixture: ComponentFixture<SarsValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarsValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
