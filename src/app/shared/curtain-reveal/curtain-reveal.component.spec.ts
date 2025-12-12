import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurtainRevealComponent } from './curtain-reveal.component';

describe('CurtainRevealComponent', () => {
  let component: CurtainRevealComponent;
  let fixture: ComponentFixture<CurtainRevealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurtainRevealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurtainRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
