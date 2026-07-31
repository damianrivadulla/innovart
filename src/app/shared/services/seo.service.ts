import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: { sourceUrl?: string | null } | null;
  opengraphUrl?: string | null;
  opengraphSiteName?: string | null;
  opengraphType?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Aplica los datos de Yoast/SEO al documento (título, meta, Open Graph, canonical).
   * @param seo - Objeto seo devuelto por la query de GraphQL
   * @param fallbackTitle - Título a usar si seo no tiene title (ej. page.title)
   */
  applySeo(seo: SeoData | null | undefined, fallbackTitle?: string | null): void {
    if (!seo) return;

    const title = seo.title || seo.opengraphTitle || fallbackTitle || '';
    if (title) {
      this.title.setTitle(title);
    }

    const desc = seo.metaDesc || seo.opengraphDescription || '';
    if (desc) {
      this.meta.updateTag({ name: 'description', content: desc });
    }

    // Open Graph
    if (title) this.meta.updateTag({ property: 'og:title', content: title });
    if (desc) this.meta.updateTag({ property: 'og:description', content: desc });
    const ogImage = seo.opengraphImage?.sourceUrl;
    if (ogImage) this.meta.updateTag({ property: 'og:image', content: ogImage });
    const ogUrl = seo.opengraphUrl;
    if (ogUrl) this.meta.updateTag({ property: 'og:url', content: ogUrl });
    const ogSiteName = seo.opengraphSiteName;
    if (ogSiteName) this.meta.updateTag({ property: 'og:site_name', content: ogSiteName });
    const ogType = seo.opengraphType;
    if (ogType) this.meta.updateTag({ property: 'og:type', content: ogType });

    // Canonical
    const canonical = seo.canonical;
    if (canonical) {
      let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }
}
