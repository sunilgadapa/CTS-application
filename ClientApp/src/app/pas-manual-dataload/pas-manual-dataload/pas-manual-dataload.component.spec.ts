import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasManualDataloadComponent } from './pas-manual-dataload.component';

describe('PasManualDataloadComponent', () => {
  let component: PasManualDataloadComponent;
  let fixture: ComponentFixture<PasManualDataloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasManualDataloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasManualDataloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
