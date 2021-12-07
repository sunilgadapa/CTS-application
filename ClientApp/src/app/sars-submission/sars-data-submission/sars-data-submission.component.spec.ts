import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarsDataSubmissionComponent  } from './sars-data-submission.component';

describe('SarsDataSubmissionComponent ', () => {
  let component: SarsDataSubmissionComponent ;
  let fixture: ComponentFixture<SarsDataSubmissionComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarsDataSubmissionComponent  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarsDataSubmissionComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
