import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { NgIf, NgClass, NgForOf } from '@angular/common';
import { GalleryHorizontalComponent } from '../../shared/gallery-horizontal/gallery-horizontal.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { QUERY_PORTFOLIO_SINGLE } from '../../queries/portfolio';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { SeoService } from '../../shared/services/seo.service';
import { VimeoService } from '../../shared/services/vimeo.service';

@Component({
  selector: 'app-single-portfolio',
  standalone: true,
  imports: [
    RouterLink,
    LayoutComponent,
    HeaderComponent,
    NgIf,
    NgClass,
    NgForOf,
    GalleryHorizontalComponent,
    LineRevealComponent,
    ParagraphRevealComponent,
    FooterComponent,
  ],
  templateUrl: './single-portfolio.component.html',
  styleUrl: './single-portfolio.component.scss'
})
export class SinglePortfolioComponent extends BaseComponentService implements OnInit, OnDestroy {
  portfolio: any;
  nextProjectUri: string | null = null;
  id: string | null;
  /** URLs de embed precomputadas para evitar recargas del iframe por change detection */
  embedUrlVideo1?: SafeResourceUrl;
  embedUrlVideo23?: SafeResourceUrl;
  embedUrlVideo4?: SafeResourceUrl;
  embedUrlVideo5?: SafeResourceUrl;
  private paramMapSub?: Subscription;

  constructor(private readonly apollo: Apollo,
              private route: ActivatedRoute,
              private seoService: SeoService,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2,
              public vimeoService: VimeoService) {
    super(elementRef, renderer, router);
  }

  ngOnInit(): void {
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadPortfolio(id);
    });
  }

  private loadPortfolio(id: string): void {
    this.id = id;
    this.portfolio = null;
    this.nextProjectUri = null;
    this.apollo.watchQuery({
      query: gql`${QUERY_PORTFOLIO_SINGLE(id)}`
    }).valueChanges.pipe(take(1)).subscribe((result: any) => {
      this.portfolio = result.data.portfolioCompany;
      const nextUri = this.portfolio?.nextPortfolioCompany?.node?.uri ?? null;
      const firstPortfolioUri = result?.data?.portfolioCompanies?.edges?.[0]?.node?.uri ?? null;
      this.nextProjectUri = nextUri || firstPortfolioUri;
      this.seoService.applySeo(this.portfolio?.seo, this.portfolio?.title);
      const fields = this.portfolio?.portfolioSingleFields;
      if (fields) {
        this.embedUrlVideo1 = this.vimeoService.getVimeoEmbedUrlSafe(fields.video1, { background: true });
        this.embedUrlVideo23 = this.vimeoService.getVimeoEmbedUrlSafe(fields.video23, { background: true });
        this.embedUrlVideo4 = this.vimeoService.getVimeoEmbedUrlSafe(fields.video4, { background: true });
        this.embedUrlVideo5 = this.vimeoService.getVimeoEmbedUrlSafe(fields.video5, { background: true });
      }
      document.body.classList.add('portfolio');
      if (this.portfolio?.portfolioSingleFields) {
        const fs = this.portfolio.portfolioSingleFields;
        if (fs.textColor) document.body.style.setProperty('--text-color', fs.textColor);
        if (fs.backgroundColor) {
          document.body.style.setProperty('--background-color', fs.backgroundColor);
          document.body.style.setProperty('--body-bg', fs.backgroundColor);
        } else {
          document.body.style.removeProperty('--background-color');
          document.body.style.removeProperty('--body-bg');
        }
        if (fs.buttonTextColor) document.body.style.setProperty('--button-text-color', fs.buttonTextColor);
        else document.body.style.removeProperty('--button-text-color');
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): void {
    this.paramMapSub?.unsubscribe();
    document.body.classList.remove('portfolio');
    document.body.style.removeProperty('--text-color');
    document.body.style.removeProperty('--background-color');
    document.body.style.removeProperty('--button-text-color');
    document.body.style.removeProperty('--body-bg');
  }

}
