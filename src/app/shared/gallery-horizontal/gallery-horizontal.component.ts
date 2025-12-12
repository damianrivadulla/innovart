import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForOf, NgIf, NgOptimizedImage, NgClass } from '@angular/common';
import Flickity from 'flickity';
import { CurtainRevealComponent } from '../curtain-reveal/curtain-reveal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-horizontal',
  standalone: true,
  imports: [
    NgForOf,
    CurtainRevealComponent,
    NgIf,
    NgOptimizedImage,
    NgClass,
  ],
  templateUrl: './gallery-horizontal.component.html',
  styleUrl: './gallery-horizontal.component.scss'
})
export class GalleryHorizontalComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;
  @Output() slideChange = new EventEmitter<{ currentIndex: number, totalSlides: number }>();
  @Output() slideClicked = new EventEmitter<any>();
  @Input() gallery: any;
  @Input() classCss: string;
  @Input() showButtons: boolean = false;
  @Input() showButtonsOutside: boolean = false;
  currentIndex?: number;
  totalSlides?: number;
  galleryEffect!: Flickity;

  constructor() {
  }

  navigateTo(item: any): void {
    // Assuming item.node.portfolioRoute = "/portfolio/portfoliotest1"
    // You should replace: "if (item.node.NAMEOFTHEPROPERTY)"
    this.slideClicked.emit(item);
    if (item.node.uri) {
      // This should be: this.router.navigate([item.node.portfolioRoute]);
      //this.router.navigate(['']);
      //this.router.navigate([item.node.uri]);
    }
  }

  ngAfterViewInit(): void {
    const elem = this.carousel.nativeElement;
    this.galleryEffect = new Flickity(elem, {
      // options
      cellAlign: "left",
      draggable: true,
      pageDots: false,
      contain: true,
      freeScroll: false,
      prevNextButtons: false,
      autoPlay: false,
      resize: true
    });

    setTimeout(() => {
      this.galleryEffect.resize();
    }, 500);

    setTimeout(() => {
      // Get total number of slides
      const totalSlides = this.galleryEffect.slides.length;

      // Emit the initial slide data
      this.currentIndex = this.galleryEffect.selectedIndex + 1;
      this.totalSlides = totalSlides;

      // Update and emit the current index whenever the slide changes
      this.galleryEffect.on('select', () => {
        this.currentIndex = this.galleryEffect.selectedIndex + 1;
        this.totalSlides = totalSlides;
      });
    }, 1000);

    this.galleryEffect.on('staticClick', (event: any, pointer: any, cellElement: Element, cellIndex: number) => {
      if (cellIndex !== undefined && this.gallery[cellIndex]) {
        const clickedItem = this.gallery[cellIndex];
        this.navigateTo(clickedItem);
      }
    });
  }

  goToNext(): void {
    this.galleryEffect.next();
  }

  goToPrev(): void {
    this.galleryEffect.previous();
  }

}
