import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-curtain-reveal',
  standalone: true,
  imports: [],
  templateUrl: './curtain-reveal.component.html',
  styleUrl: './curtain-reveal.component.scss'
})
export class CurtainRevealComponent implements AfterViewInit {
  @ViewChild('curtainWrapper') curtainElement!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => { 
      ScrollReveal().reveal(this.curtainElement.nativeElement, {
      //ScrollReveal().reveal('.reveal-content', {
        interval: 300,
        duration: 1000,
        viewFactor: 0.1,
        beforeReveal: (el) => {
          (el as HTMLElement).classList.add('revealed');
        },
        reset: false // Animation occurs only once
      });
    }, 200);
  }
}
