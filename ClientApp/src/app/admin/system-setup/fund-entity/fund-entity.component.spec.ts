import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundEntityComponent } from './fund-entity.component';

describe('FundEntityComponent', () => {
  let component: FundEntityComponent;
  let fixture: ComponentFixture<FundEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
