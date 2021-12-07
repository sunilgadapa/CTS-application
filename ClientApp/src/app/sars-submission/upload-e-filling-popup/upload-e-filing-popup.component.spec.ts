import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEFilePopupComponent } from './upload-e-filing-popup.component';

describe('UploadEFilePopupComponent', () => {
  let component: UploadEFilePopupComponent;
  let fixture: ComponentFixture<UploadEFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadEFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
