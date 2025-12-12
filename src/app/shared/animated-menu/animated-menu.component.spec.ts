import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedMenuComponent } from './animated-menu.component';

describe('AnimatedMenuComponent', () => {
  let component: AnimatedMenuComponent;
  let fixture: ComponentFixture<AnimatedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
