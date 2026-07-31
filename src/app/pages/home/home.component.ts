import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { NgForOf, NgIf } from '@angular/common';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { GalleryHorizontalComponent } from '../../shared/gallery-horizontal/gallery-horizontal.component';
import { GalleryTextHorizontalComponent } from '../../shared/gallery-text-horizontal/gallery-text-horizontal.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import { CurtainRevealComponent } from '../../shared/curtain-reveal/curtain-reveal.component';
import { QUERY_HOME } from '../../queries/home';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { SeoService } from '../../shared/services/seo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    NgIf,
    NgForOf,
    GalleryHorizontalComponent,
    GalleryTextHorizontalComponent,
    LineRevealComponent,
    ParagraphRevealComponent,
    FooterComponent,
    CurtainRevealComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponentService implements OnInit {
  home: any;

  constructor(private readonly apollo: Apollo,
              private seoService: SeoService,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
    super(elementRef, renderer, router);
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_HOME}`
    }).valueChanges.subscribe((result: any) => {
      const page = result.data.page;
      this.home = page.homeFields;
      this.seoService.applySeo(page.seo, page.title);
    });
  }

}
