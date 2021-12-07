import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaxsourcecodeComponent } from './addtaxsourcecode.component';

describe('AddtaxsourcecodeComponent', () => {
  let component: AddtaxsourcecodeComponent;
  let fixture: ComponentFixture<AddtaxsourcecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtaxsourcecodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtaxsourcecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
