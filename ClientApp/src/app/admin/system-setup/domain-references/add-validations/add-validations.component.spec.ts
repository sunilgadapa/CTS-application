import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValidationsComponent } from './add-validations.component';

describe('AddValidationsComponent', () => {
  let component: AddValidationsComponent;
  let fixture: ComponentFixture<AddValidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddValidationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
