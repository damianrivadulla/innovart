import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphRevealComponent } from './paragraph-reveal.component';

describe('ParagraphRevealComponent', () => {
  let component: ParagraphRevealComponent;
  let fixture: ComponentFixture<ParagraphRevealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphRevealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParagraphRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
