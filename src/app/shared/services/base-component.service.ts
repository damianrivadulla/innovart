import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BaseComponentService {
  selector: string;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              public router: Router) {
    this.addBodyClass();
  }

  getComponentSelector(): string {
    return this.renderer.selectRootElement(this.el.nativeElement).tagName.toLowerCase();
  }

  addBodyClass(): void {
    const bodyElement = document.body;
    const className = this.getComponentSelector().replace('app-', '');
    const uriSegments = this.router.url.split('/').join(' ');
    //this.renderer.setAttribute(bodyElement, 'class', `${className} ${uriSegments}`);
    this.renderer.setAttribute(bodyElement, 'class', `${uriSegments}`);
    // ScrollReveal().reveal('body') deja visibility/opacity en el body; al navegar SPA hay que limpiarlo
    bodyElement.style.removeProperty('visibility');
    bodyElement.style.removeProperty('opacity');
    bodyElement.style.removeProperty('transform');
    bodyElement.style.removeProperty('transition');
  }
}
