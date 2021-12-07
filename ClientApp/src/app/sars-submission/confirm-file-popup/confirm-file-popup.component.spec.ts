import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFilePopupComponent } from './confirm-file-popup.component';

describe('ConfirmFilePopupComponent', () => {
  let component: ConfirmFilePopupComponent;
  let fixture: ComponentFixture<ConfirmFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
