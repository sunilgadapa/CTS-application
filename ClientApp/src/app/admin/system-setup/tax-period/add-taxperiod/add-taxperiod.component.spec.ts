import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxperiodComponent } from './add-taxperiod.component';

describe('AddTaxperiodComponent', () => {
  let component: AddTaxperiodComponent;
  let fixture: ComponentFixture<AddTaxperiodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTaxperiodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
