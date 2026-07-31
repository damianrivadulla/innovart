import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Convierte un ID o URL de Vimeo a una URL de embed del reproductor
   * @param vimeoIdOrUrl - ID numérico de Vimeo o URL completa (ej: "123456789" o "https://vimeo.com/123456789")
   * @param options - autoplay: reproducir al cargar; background: true = sin controles, autoplay, loop, mute (estilo background)
   * @returns URL del reproductor de Vimeo como string
   */
  getVimeoEmbedUrl(vimeoIdOrUrl: string | null | undefined, options?: { autoplay?: boolean; background?: boolean }): string {
    if (!vimeoIdOrUrl) {
      return '';
    }

    const trimmed = vimeoIdOrUrl.trim();
    const background = options?.background ?? false;
    const autoplay = options?.autoplay ?? false;
    // background=1: chromeless, sin controles, autoplay, loop, muted (requiere cuenta Vimeo de pago)
    const params = background
      ? 'background=1'
      : autoplay
        ? 'autoplay=1&loop=1&muted=1&play_button_position=bottom'
        : 'autoplay=0&loop=0&muted=0&play_button_position=bottom';

    // Si es solo un número (ID), usarlo directamente
    if (/^\d+$/.test(trimmed)) {
      return `https://player.vimeo.com/video/${trimmed}?${params}`;
    }

    // Si es una URL completa, extraer el ID
    const videoIdMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
    const videoId = videoIdMatch && videoIdMatch[1];
    
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?${params}`;
    }

    return trimmed;
  }

  /**
   * Convierte un ID o URL de Vimeo a una URL de embed sanitizada (SafeResourceUrl)
   * @param vimeoIdOrUrl - ID numérico de Vimeo o URL completa
   * @param options - autoplay: true para reproducir al cargar
   * @returns SafeResourceUrl sanitizado para usar en iframes
   */
  getVimeoEmbedUrlSafe(vimeoIdOrUrl: string | null | undefined, options?: { autoplay?: boolean; background?: boolean }): SafeResourceUrl {
    const embedUrl = this.getVimeoEmbedUrl(vimeoIdOrUrl, options);
    if (!embedUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
