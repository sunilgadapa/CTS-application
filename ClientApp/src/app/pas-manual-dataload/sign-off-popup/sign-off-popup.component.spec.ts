import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOffPopupComponent } from './sign-off-popup.component';

describe('SignOffPopupComponent', () => {
  let component: SignOffPopupComponent;
  let fixture: ComponentFixture<SignOffPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignOffPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOffPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
