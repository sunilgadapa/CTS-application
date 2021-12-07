import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxModuleComponent } from './tax-module.component';

describe('TaxModuleComponent', () => {
  let component: TaxModuleComponent;
  let fixture: ComponentFixture<TaxModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
