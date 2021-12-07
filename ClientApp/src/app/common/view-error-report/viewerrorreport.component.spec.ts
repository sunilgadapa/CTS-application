import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerrorreportComponent } from './viewerrorreport.component';

describe('ViewerrorreportComponent', () => {
  let component: ViewerrorreportComponent;
  let fixture: ComponentFixture<ViewerrorreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerrorreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerrorreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
