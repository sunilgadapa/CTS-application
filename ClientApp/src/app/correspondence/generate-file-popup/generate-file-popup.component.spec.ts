import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFilePopupComponent } from './generate-file-popup.component';

describe('GenerateFilePopupComponent', () => {
  let component: GenerateFilePopupComponent;
  let fixture: ComponentFixture<GenerateFilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateFilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateFilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
