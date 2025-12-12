import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-line-reveal',
  standalone: true,
  imports: [],
  templateUrl: './line-reveal.component.html',
  styleUrl: './line-reveal.component.scss'
})
export class LineRevealComponent implements AfterViewInit {
  @ViewChild('lineWrapper') lineElement!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      ScrollReveal().reveal(this.lineElement.nativeElement, {
      //ScrollReveal().reveal('.reveal-content', {
        duration: 1000,
        viewFactor: 0.1,
        opacity: 1,
        beforeReveal: (el) => {
          (el as HTMLElement).classList.add('revealed');
        },
        reset: false // Animation occurs only once
      });
    }, 100);
  }
}
