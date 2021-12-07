import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMananagementComponent } from './user-mananagement.component';
describe('UserMananagementComponent', () => {
  let component: UserMananagementComponent;
  let fixture: ComponentFixture<UserMananagementComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMananagementComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserMananagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
