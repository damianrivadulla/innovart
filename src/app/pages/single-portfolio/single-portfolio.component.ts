import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { WpImgPipe } from '../../shared/pipes/wp-img.pipe';

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
    WpImgPipe,
  ],
  templateUrl: './single-portfolio.component.html',
  styleUrl: './single-portfolio.component.scss'
})
export class SinglePortfolioComponent extends BaseComponentService implements OnInit, OnDestroy {
  portfolio: any;
  nextProjectUri: string | null = null;
  id: string | null;
  /** URLs de embed / archivo precomputadas para evitar recargas por change detection */
  embedUrlVideo1?: SafeResourceUrl;
  embedUrlVideo23?: SafeResourceUrl;
  embedUrlVideo4?: SafeResourceUrl;
  embedUrlVideo5?: SafeResourceUrl;
  fileUrlVideo1?: string;
  fileUrlVideo23?: string;
  fileUrlVideo4?: string;
  fileUrlVideo5?: string;
  repeaterVideos: Array<{ embed?: SafeResourceUrl; file?: string }> = [];
  descriptionClamped = false;
  showReadMore = false;
  galleryClamped = false;
  showGalleryReadMore = false;
  detailClamped = false;
  showDetailReadMore = false;
  private descriptionExpanded = false;
  private galleryExpanded = false;
  private detailExpanded = false;
  private paramMapSub?: Subscription;

  @ViewChild('arrivalDescription') arrivalDescription?: ElementRef<HTMLElement>;
  @ViewChild('galleryDescription') galleryDescription?: ElementRef<HTMLElement>;
  @ViewChild('detailDescription') detailDescription?: ElementRef<HTMLElement>;

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
    this.descriptionExpanded = false;
    this.descriptionClamped = false;
    this.showReadMore = false;
    this.galleryExpanded = false;
    this.galleryClamped = false;
    this.showGalleryReadMore = false;
    this.detailExpanded = false;
    this.detailClamped = false;
    this.showDetailReadMore = false;
    this.apollo.watchQuery({
      query: gql`${QUERY_PORTFOLIO_SINGLE(id)}`
    }).valueChanges.pipe(take(1)).subscribe((result: any) => {
      this.portfolio = result.data.portfolioCompany;
      const nextUri = this.portfolio?.nextPortfolioCompany?.node?.uri ?? null;
      const firstPortfolioUri = result?.data?.portfolioCompanies?.edges?.[0]?.node?.uri ?? null;
      this.nextProjectUri = nextUri || firstPortfolioUri;
      this.seoService.applySeo(this.portfolio?.seo, this.portfolio?.title);
      const fields = this.portfolio?.portfolioSingleFields;
      this.embedUrlVideo1 = undefined;
      this.embedUrlVideo23 = undefined;
      this.embedUrlVideo4 = undefined;
      this.embedUrlVideo5 = undefined;
      this.fileUrlVideo1 = undefined;
      this.fileUrlVideo23 = undefined;
      this.fileUrlVideo4 = undefined;
      this.fileUrlVideo5 = undefined;
      this.repeaterVideos = [];
      if (fields) {
        const v1 = this.vimeoService.resolveBackgroundVideo(fields.video1);
        const v23 = this.vimeoService.resolveBackgroundVideo(fields.video23);
        const v4 = this.vimeoService.resolveBackgroundVideo(fields.video4);
        const v5 = this.vimeoService.resolveBackgroundVideo(fields.video5);
        if (v1?.kind === 'file') this.fileUrlVideo1 = v1.src;
        else if (v1?.kind === 'embed') this.embedUrlVideo1 = v1.src;
        if (v23?.kind === 'file') this.fileUrlVideo23 = v23.src;
        else if (v23?.kind === 'embed') this.embedUrlVideo23 = v23.src;
        if (v4?.kind === 'file') this.fileUrlVideo4 = v4.src;
        else if (v4?.kind === 'embed') this.embedUrlVideo4 = v4.src;
        if (v5?.kind === 'file') this.fileUrlVideo5 = v5.src;
        else if (v5?.kind === 'embed') this.embedUrlVideo5 = v5.src;
        this.repeaterVideos = (fields.repeater ?? []).map((item: any) => {
          const resolved = this.vimeoService.resolveBackgroundVideo(item?.videoRepeater);
          if (resolved?.kind === 'file') return { file: resolved.src };
          if (resolved?.kind === 'embed') return { embed: resolved.src };
          return {};
        });
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
      setTimeout(() => this.measureDescriptions());
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.measureDescriptions();
  }

  get categoryColumns(): any[][] {
    const items = this.portfolio?.categories?.edges ?? [];
    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  }

  expandDescription(): void {
    this.descriptionExpanded = true;
    this.descriptionClamped = false;
    this.showReadMore = false;
  }

  expandGalleryDescription(): void {
    this.galleryExpanded = true;
    this.galleryClamped = false;
    this.showGalleryReadMore = false;
  }

  expandDetailDescription(): void {
    this.detailExpanded = true;
    this.detailClamped = false;
    this.showDetailReadMore = false;
  }

  private measureDescriptions(): void {
    this.measureBlock('arrival');
    this.measureBlock('gallery');
    this.measureBlock('detail');
  }

  private measureBlock(kind: 'arrival' | 'gallery' | 'detail'): void {
    const expanded = this.isExpanded(kind);
    const ref = this.readMoreElement(kind);
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (expanded || !ref || !isMobile) {
      this.setReadMore(kind, false, false);
      return;
    }
    this.setReadMore(kind, true, false);
    setTimeout(() => {
      const currentRef = this.readMoreElement(kind);
      if (!currentRef || this.isExpanded(kind)) {
        return;
      }
      const box = currentRef.nativeElement;
      const overflows = box.scrollHeight > box.clientHeight + 1;
      this.setReadMore(kind, overflows, overflows);
    });
  }

  private isExpanded(kind: 'arrival' | 'gallery' | 'detail'): boolean {
    if (kind === 'arrival') {
      return this.descriptionExpanded;
    }
    if (kind === 'gallery') {
      return this.galleryExpanded;
    }
    return this.detailExpanded;
  }

  private readMoreElement(kind: 'arrival' | 'gallery' | 'detail'): ElementRef<HTMLElement> | undefined {
    if (kind === 'arrival') {
      return this.arrivalDescription;
    }
    if (kind === 'gallery') {
      return this.galleryDescription;
    }
    return this.detailDescription;
  }

  private setReadMore(kind: 'arrival' | 'gallery' | 'detail', clamped: boolean, show: boolean): void {
    if (kind === 'arrival') {
      this.descriptionClamped = clamped;
      this.showReadMore = show;
      return;
    }
    if (kind === 'gallery') {
      this.galleryClamped = clamped;
      this.showGalleryReadMore = show;
      return;
    }
    this.detailClamped = clamped;
    this.showDetailReadMore = show;
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
