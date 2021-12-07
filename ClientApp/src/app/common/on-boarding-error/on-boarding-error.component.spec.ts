import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingErrorComponent } from './on-boarding-error.component';

describe('OnBoardingErrorComponent', () => {
  let component: OnBoardingErrorComponent;
  let fixture: ComponentFixture<OnBoardingErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardingErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardingErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
