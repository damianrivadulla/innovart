import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { Title } from '@angular/platform-browser';
import { QUERY_LEGAL } from '../../queries/legal';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    NgIf,
  ],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent extends BaseComponentService implements OnInit {
  privacy: any;
  terms: any;

  constructor(private readonly apollo: Apollo,
              private title: Title,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
    super(elementRef, renderer, router);
  }

  get isPrivacy(): boolean {
    return this.router.url.split('?')[0].replace(/\/$/, '').endsWith('privacy-policy');
  }

  get current(): any {
    return this.isPrivacy ? this.privacy : this.terms;
  }

  get updatedLabel(): string {
    const match = this.current?.content?.match(/Last updated:\s*([^<]+)/i);
    if (!match) {
      return '';
    }
    const parsed = new Date(match[1].trim());
    if (Number.isNaN(parsed.getTime())) {
      return `Updated – ${match[1].trim()}`;
    }
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    return `Updated – ${month}/${day}/${year}`;
  }

  get bodyHtml(): string {
    const content = this.current?.content || '';
    return content
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '')
      .replace(/<p>\s*<strong>\s*Last updated:[\s\S]*?<\/strong>\s*<\/p>/gi, '');
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_LEGAL}`
    }).valueChanges.subscribe((result: any) => {
      this.privacy = result.data.privacy;
      this.terms = result.data.terms;
      if (this.current?.title) {
        this.title.setTitle(this.current.title);
      }
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
