import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteFilePopupComponent } from './promote-file-popup.component';

describe('PromoteFilePopupComponent', () => {
  let component: PromoteFilePopupComponent;
  let fixture: ComponentFixture<PromoteFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoteFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
