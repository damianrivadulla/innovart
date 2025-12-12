import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { QUERY_PRIVACY } from '../../queries/privacy';
import { NgIf } from '@angular/common';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    LineRevealComponent,
    ParagraphRevealComponent,
    NgIf
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent extends BaseComponentService implements OnInit {
  page: any;

  constructor(private readonly apollo: Apollo,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
    super(elementRef, renderer, router);
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_PRIVACY}`
    }).valueChanges.subscribe((result: any) => {
      console.log("@==>", result.data.page);
      this.page = result.data.page;
    });
  }

}
