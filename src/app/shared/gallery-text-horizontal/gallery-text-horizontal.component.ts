import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import Flickity from 'flickity';

@Component({
  selector: 'app-gallery-text-horizontal',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './gallery-text-horizontal.component.html',
  styleUrl: './gallery-text-horizontal.component.scss'
})
export class GalleryTextHorizontalComponent implements AfterViewInit {
  @ViewChild('carouselText') carousel!: ElementRef;
  @Input() gallery: any;
  galleryEffect!: Flickity;

  ngAfterViewInit(): void {
    const elem = this.carousel.nativeElement;
    this.galleryEffect = new Flickity(elem, {
      // options
      //cellAlign: 'center',
      draggable: true,
      pageDots: false,
      freeScroll: false,
      prevNextButtons: false,
      autoPlay: 5000,
      wrapAround: true,
      //groupCells: true,
      resize: true,      
    });

    setTimeout(() => {
      this.galleryEffect.resize();
    }, 100)

  }

  goToNext(): void {
    this.galleryEffect.next();
  }

  goToPrev(): void {
    this.galleryEffect.previous();
  }



}
