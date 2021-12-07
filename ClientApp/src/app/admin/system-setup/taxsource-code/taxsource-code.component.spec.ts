import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxsourceCodeComponent } from './taxsource-code.component';

describe('TaxsourceCodeComponent', () => {
  let component: TaxsourceCodeComponent;
  let fixture: ComponentFixture<TaxsourceCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxsourceCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxsourceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
