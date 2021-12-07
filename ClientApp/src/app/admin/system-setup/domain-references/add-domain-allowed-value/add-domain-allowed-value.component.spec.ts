import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainAllowedValueComponent } from './add-domain-allowed-value.component';

describe('AddDomainAllowedValueComponent', () => {
  let component: AddDomainAllowedValueComponent;
  let fixture: ComponentFixture<AddDomainAllowedValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDomainAllowedValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDomainAllowedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
