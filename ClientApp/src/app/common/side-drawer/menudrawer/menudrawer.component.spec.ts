import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenudrawerComponent } from './menudrawer.component';

describe('MenudrawerComponent', () => {
  let component: MenudrawerComponent;
  let fixture: ComponentFixture<MenudrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenudrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenudrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
