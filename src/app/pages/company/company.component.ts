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
import { QUERY_COMPANY } from '../../queries/company';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { SeoService } from '../../shared/services/seo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
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
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent extends BaseComponentService implements OnInit {
  page: any;
  capabilitiesLeft: any[] = [];
  capabilitiesRight: any[] = [];

  constructor(private readonly apollo: Apollo,
              private seoService: SeoService,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
    super(elementRef, renderer, router);
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_COMPANY}`,
      fetchPolicy: 'network-only',
    }).valueChanges.subscribe((result: any) => {
      this.page = result?.data?.page;
      const items = this.page?.companyFields?.valuesItems ?? [];
      this.capabilitiesLeft = items.slice(0, 2);
      this.capabilitiesRight = items.slice(2);
      this.seoService.applySeo(this.page?.seo, this.page?.title);
    });
  }

  toggleAccordion(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.accordion-content')) {
      return;
    }
    (event.currentTarget as HTMLElement).classList.toggle('active');
  }

}
