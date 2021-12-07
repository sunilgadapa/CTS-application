import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainReferencesComponent } from './domain-references.component';

describe('DomainReferencesComponent', () => {
  let component: DomainReferencesComponent;
  let fixture: ComponentFixture<DomainReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainReferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
