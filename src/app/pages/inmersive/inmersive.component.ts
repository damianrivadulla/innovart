import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { NgIf } from '@angular/common';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { GalleryHorizontalComponent } from '../../shared/gallery-horizontal/gallery-horizontal.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import ScrollReveal from 'scrollreveal';
import { QUERY_INMERSIVE } from '../../queries/inmersive';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { SeoService } from '../../shared/services/seo.service';
import { VimeoService } from '../../shared/services/vimeo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inmersive',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    NgIf,
    GalleryHorizontalComponent,
    LineRevealComponent,
    ParagraphRevealComponent,
    FooterComponent,
  ],
  templateUrl: './inmersive.component.html',
  styleUrl: './inmersive.component.scss'
})
export class InmersiveComponent extends BaseComponentService implements OnInit, OnDestroy {
  inmersive: any;
  /** URL de embed precomputada para evitar recargas del iframe por change detection */
  embedUrlMainVideo?: SafeResourceUrl;

  constructor(private readonly apollo: Apollo,
              private seoService: SeoService,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2,
              public vimeoService: VimeoService) {
    super(elementRef, renderer, router);
  }

  ngAfterViewInit(): void {
    ScrollReveal().reveal('body', {
      interval: 200,
      duration: 1000,
      viewFactor: .1,
    });
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_INMERSIVE}`
    }).valueChanges.subscribe({
      next: (result: any) => {
        console.log('Inmersive data:', result?.data?.page);
        if (result?.data?.page?.inmersive) {
          const page = result.data.page;
          this.inmersive = page.inmersive;
          this.embedUrlMainVideo = this.vimeoService.getVimeoEmbedUrlSafe(this.inmersive?.mainVideo, { background: true });
          this.seoService.applySeo(page.seo, page.title);
          console.log('Inmersive object:', this.inmersive);
          // Aplicar clase inmersive al body para activar estilos globales
          document.body.classList.add('inmersive');
          
          // Aplicar variables CSS dinámicas al body
          // Texto blanco y fondo carbon
          document.body.style.setProperty('--text-color', '#c7c5bd');
          document.body.style.setProperty('--background-color', '#1a1a1a');
          document.body.style.setProperty('--body-bg', '#1a1a1a');
          document.body.style.setProperty('--button-text-color', '#c7c5bd');
        }
      },
      error: (error) => {
        console.error('Error loading inmersive data:', error);
      }
    });
  }

  ngOnDestroy(): void {
    // Remover clase inmersive del body al salir del componente
    document.body.classList.remove('inmersive');
    
    // Limpiar variables CSS del body
    document.body.style.removeProperty('--text-color');
    document.body.style.removeProperty('--background-color');
    document.body.style.removeProperty('--button-text-color');
    document.body.style.removeProperty('--body-bg');
  }

}
