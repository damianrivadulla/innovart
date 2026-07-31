import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
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
    NgClass,
  ],
  templateUrl: './gallery-horizontal.component.html',
  styleUrl: './gallery-horizontal.component.scss'
})
export class GalleryHorizontalComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;
  @Output() slideChange = new EventEmitter<{ currentIndex: number, totalSlides: number }>();
  @Output() slideClicked = new EventEmitter<any>();
  @Input() gallery: any;
  @Input() classCss: string;
  @Input() showButtons: boolean = false;
  @Input() showButtonsOutside: boolean = false;
  @Input() showCaption: boolean = false;
  currentIndex?: number;
  totalSlides?: number;
  galleryEffect!: Flickity;
  private isInitialized = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If gallery changes and Flickity is already initialized, reinitialize
    if (changes['gallery'] && !changes['gallery'].firstChange && this.isInitialized && this.galleryEffect) {
      this.galleryEffect.destroy();
      this.isInitialized = false;
      this.waitForImagesToLoad().then(() => {
        this.initializeFlickity();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.galleryEffect) {
      this.galleryEffect.destroy();
    }
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
    // Wait for images to load before initializing Flickity
    this.waitForImagesToLoad().then(() => {
      this.initializeFlickity();
    });
  }

  private waitForImagesToLoad(): Promise<void> {
    return new Promise((resolve) => {
      const elem = this.carousel.nativeElement;
      const images = elem.querySelectorAll('img');
      
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          // Small delay to ensure DOM is fully updated
          setTimeout(() => resolve(), 100);
        }
      };

      images.forEach((img: HTMLImageElement) => {
        if (img.complete) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete);
          img.addEventListener('error', checkComplete); // Also resolve on error
        }
      });
    });
  }

  private initializeFlickity(): void {
    if (!this.carousel?.nativeElement) {
      return;
    }

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

    this.isInitialized = true;

    // Resize after a small delay to ensure layout is complete
    setTimeout(() => {
      if (this.galleryEffect) {
        this.galleryEffect.resize();
      }
    }, 100);

    setTimeout(() => {
      if (this.galleryEffect) {
        // Get total number of slides
        const totalSlides = this.galleryEffect.slides.length;

        // Emit the initial slide data
        this.currentIndex = this.galleryEffect.selectedIndex + 1;
        this.totalSlides = totalSlides;

        // Update and emit the current index whenever the slide changes
        this.galleryEffect.on('select', () => {
          this.currentIndex = this.galleryEffect.selectedIndex + 1;
          this.totalSlides = totalSlides;
          this.cdr.detectChanges(); // Flickity corre fuera de Angular: forzar actualización del caption
        });
      }
    }, 200);

    this.galleryEffect.on('staticClick', (event: any, pointer: any, cellElement: Element, cellIndex: number) => {
      if (cellIndex !== undefined && this.gallery && this.gallery[cellIndex]) {
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

  /** Texto a mostrar bajo las flechas: caption → title → altText del slide actual */
  get currentSlideLabel(): string {
    const idx = ((this.currentIndex ?? 1) - 1);
    const item = this.gallery?.[idx];
    if (!item?.node) return '';
    const n = item.node;
    return (n.caption && n.caption.trim()) || (n.title && n.title.trim()) || (n.altText && n.altText.trim()) || '';
  }

  /** Mismo texto que currentSlideLabel pero normalizado: si es texto plano lo envuelve en <p> para que todos los slides tengan el mismo markup */
  get currentSlideLabelHtml(): string {
    const raw = this.currentSlideLabel;
    if (!raw || !raw.trim()) return '';
    if (raw.trim().startsWith('<')) return raw;
    const div = document.createElement('div');
    div.textContent = raw;
    return '<p>' + div.innerHTML + '</p>';
  }

}
