import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { GalleryHorizontalComponent } from '../../shared/gallery-horizontal/gallery-horizontal.component';
import { GalleryTextHorizontalComponent } from '../../shared/gallery-text-horizontal/gallery-text-horizontal.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import { CurtainRevealComponent } from '../../shared/curtain-reveal/curtain-reveal.component';
import ScrollReveal from 'scrollreveal';
import { QUERY_PORTFOLIO, QUERY_PORTFOLIO_INFO } from '../../queries/portfolio';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { map, Observable, startWith, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
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
    MatProgressSpinner,
    AsyncPipe,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent extends BaseComponentService implements OnInit {
  portfolio$: Observable<{ loading: boolean, portfolio: any[] }> | null = null;
  portfolioInfo: any = null;
  portfolio: any[] = [];
  noPosts = 0;
  hasMore = true;
  afterKey = null;

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
    //this.loadFirstN();
    this.loadFirstNv1();
    this.loadPageInfo();
  }

  redirectToPortfolio(item: any) {
    this.router.navigate([item.node.uri]);
  }

  loadPageInfo() {
    this.apollo
    .watchQuery({query: gql`${QUERY_PORTFOLIO_INFO}`})
    .valueChanges
    .subscribe((result: any) => {
      console.log("@==>", result.data.page);
      this.portfolioInfo = result.data.page;
    });
  }

  loadFirstNv1(noPosts: number = 3) {
    this.apollo
    .watchQuery({query: gql`${QUERY_PORTFOLIO(noPosts, this.afterKey)}`})
    .valueChanges
    .subscribe((result: any) => {
      console.log("@==>", result.data.portfolioCompanies);
      result.data.portfolioCompanies.edges.forEach((edge: any) => {
        this.portfolio.push(edge)
      });
      this.afterKey = result.data.portfolioCompanies.pageInfo.endCursor;
      this.noPosts = result.data.portfolioCompanies.edges.length;
      this.hasMore = result.data.portfolioCompanies.pageInfo.hasNextPage;
    });
  }

  loadFirstN(noPosts: number = 3) {
    const query: any = this.apollo.watchQuery({
      query: gql`${QUERY_PORTFOLIO(noPosts, this.afterKey)}`
    });

    this.portfolio$ = query.valueChanges.pipe(
      startWith({loading: true}),
      tap(({loading, data}) => {
        if (!loading) {
          console.log("@==>", data.portfolioCompanies.edges);
          const newItems = data.portfolioCompanies.edges;
          // this.portfolio = [...this.portfolio, ...newItems];
          newItems.forEach((edge: any) => {
            this.portfolio.push(edge)
          });
          this.afterKey = data.portfolioCompanies.pageInfo.endCursor;
          this.noPosts = newItems.length;
          this.hasMore = data.portfolioCompanies.pageInfo.hasNextPage;
        }
      }),
      map((result: any) => ({
        loading: result.loading
      }))
    );
  }

  loadMore() {
    this.loadFirstN();
  }

}
