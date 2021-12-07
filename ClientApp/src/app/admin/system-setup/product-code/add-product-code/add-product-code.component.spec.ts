import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCodeComponent } from './add-product-code.component';

describe('AddProductCodeComponent', () => {
  let component: AddProductCodeComponent;
  let fixture: ComponentFixture<AddProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
