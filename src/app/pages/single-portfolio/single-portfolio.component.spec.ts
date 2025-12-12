import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePortfolioComponent } from './single-portfolio.component';

describe('SinglePortfolioComponent', () => {
  let component: SinglePortfolioComponent;
  let fixture: ComponentFixture<SinglePortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
