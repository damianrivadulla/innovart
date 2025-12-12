import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryTextHorizontalComponent } from './gallery-text-horizontal.component';

describe('GalleryTextHorizontalComponent', () => {
  let component: GalleryTextHorizontalComponent;
  let fixture: ComponentFixture<GalleryTextHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryTextHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryTextHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
