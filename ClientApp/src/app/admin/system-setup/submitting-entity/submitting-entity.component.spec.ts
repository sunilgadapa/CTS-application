import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittingEntityComponent } from './submitting-entity.component';

describe('SubmittingEntityComponent', () => {
  let component: SubmittingEntityComponent;
  let fixture: ComponentFixture<SubmittingEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittingEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittingEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
