import { Pipe, PipeTransform } from '@angular/core';

export interface WpMediaNode {
  sourceUrl?: string | null;
  srcSet?: string | null;
}

function isGifUrl(url?: string | null): boolean {
  return !!url && /\.gif(\?|#|$)/i.test(url);
}

/**
 * WordPress resized GIFs lose animation. Use original sourceUrl for GIFs;
 * keep responsive srcSet for everything else.
 *
 * Usage:
 *   [attr.src]="node | wpImg:'src'"
 *   [attr.srcset]="node | wpImg:'srcset'"
 */
@Pipe({
  name: 'wpImg',
  standalone: true,
  pure: true,
})
export class WpImgPipe implements PipeTransform {
  transform(
    node: WpMediaNode | null | undefined,
    attr: 'src' | 'srcset'
  ): string | null {
    if (!node) return null;

    const gif = isGifUrl(node.sourceUrl);

    if (attr === 'src') {
      return gif ? (node.sourceUrl ?? null) : null;
    }

    return gif ? null : (node.srcSet ?? null);
  }
}
