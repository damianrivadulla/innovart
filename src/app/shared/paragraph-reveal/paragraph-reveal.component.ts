import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import SplitType from 'split-type'

@Component({
  selector: 'app-paragraph-reveal',
  standalone: true,
  imports: [],
  templateUrl: './paragraph-reveal.component.html',
  styleUrl: './paragraph-reveal.component.scss'
})
export class ParagraphRevealComponent implements AfterViewInit {
  @Input({required: true}) classSelector!: string;
  @ViewChild('container', {static: true}) container!: ElementRef<HTMLElement>;
  textAnim: any;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.initializeAnimation();
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
  }

  @HostListener('window:resize')
  onResize() {
    ScrollTrigger.refresh();
  }

  initializeAnimation() {
    requestAnimationFrame(() => {
      if (this.textAnim) {
        this.textAnim.progress(1).kill();
      }

      const element = this.container.nativeElement.querySelector('.' + this.classSelector);
      if (!element) {
        return;
      }

      const splitInstance = new SplitType(element as HTMLElement, {types: 'lines', lineClass: 'lineChild'});
      const lines = splitInstance.lines || [];

      if (!lines.length) {
        splitInstance.revert();
        return;
      }

      lines.forEach(line => {
          const lineParent = this.renderer.createElement('div');
          this.renderer.addClass(lineParent, 'lineParent');
          this.renderer.setStyle(lineParent, 'overflow', 'hidden');
          this.renderer.setStyle(lineParent, 'position', 'relative');
          line.parentNode?.replaceChild(lineParent, line);
          lineParent.appendChild(line);
        });

      const childs = element.querySelectorAll('.lineChild') as NodeListOf<HTMLElement>;
      const targets = Array.from(childs);

      if (!targets.length) {
        splitInstance.revert();
        return;
      }

      this.textAnim = gsap.fromTo(
          targets,
          {yPercent: 100},
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top+=100 80%',
              end: 'bottom-=100 20%',
              toggleActions: 'play none none none',
            },
            onComplete: () => {
              splitInstance.revert();
            }
          }
        );

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
    });
  }

}
