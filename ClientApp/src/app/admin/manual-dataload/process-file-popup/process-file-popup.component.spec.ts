import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFilePopupComponent } from './process-file-popup.component';

describe('ProcessFilePopupComponent', () => {
  let component: ProcessFilePopupComponent;
  let fixture: ComponentFixture<ProcessFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
