import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryHorizontalComponent } from './gallery-horizontal.component';

describe('GalleryHorizontalComponent', () => {
  let component: GalleryHorizontalComponent;
  let fixture: ComponentFixture<GalleryHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
