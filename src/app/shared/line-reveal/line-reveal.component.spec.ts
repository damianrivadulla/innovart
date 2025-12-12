import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineRevealComponent } from './line-reveal.component';

describe('LineRevealComponent', () => {
  let component: LineRevealComponent;
  let fixture: ComponentFixture<LineRevealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineRevealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
