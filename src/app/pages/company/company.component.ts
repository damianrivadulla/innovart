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
import ScrollReveal from 'scrollreveal';
import { QUERY_COMPANY } from '../../queries/company';
import { BaseComponentService } from '../../shared/services/base-component.service';
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

  constructor(private readonly apollo: Apollo,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
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
      query: gql`${QUERY_COMPANY}`
    }).valueChanges.subscribe((result: any) => {
      console.log("@==>", result.data.page);
      this.page = result.data.page;
    });
  }

  toggleAccordion(event: any): void {
    event.currentTarget.parentElement.parentElement.classList.toggle('active');
  }

}
