import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingEventComponent } from './messaging-event.component';

describe('MessagingEventComponent', () => {
  let component: MessagingEventComponent;
  let fixture: ComponentFixture<MessagingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagingEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
