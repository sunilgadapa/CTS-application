import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarsSnapshotComponent } from './sars-snapshot.component';

describe('SarsSnapshotComponent', () => {
  let component: SarsSnapshotComponent;
  let fixture: ComponentFixture<SarsSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarsSnapshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
