import { Component, computed, inject, input } from '@angular/core'
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser'
import { RouterLink } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'sb-uic-app-toc-iframe-page',
  imports: [RouterLink, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './app-toc-iframe-page.component.html',
  styleUrl: './app-toc-iframe-page.component.scss',
})
export class AppTocIframePageComponent {
  private readonly sanitizer = inject(DomSanitizer)

  // Signal inputs: the template re-renders automatically whenever the parent
  // updates these, even if the values arrive after the parent's ngOnInit.
  readonly iframeUrl = input<string>('')
  readonly logoUrl = input<SafeUrl | string | null>(null)
  readonly redirectUrl = input<string>('')

  /**
   * <iframe [src]> is a resource-URL context, so Angular blocks plain strings.
   * Only trust absolute http(s) URLs (e.g. the LTI launch URL from the API).
   */
  readonly safeIframeUrl = computed<SafeResourceUrl | null>(() => {
    const url = (this.iframeUrl() || '').trim()
    return /^https?:\/\//i.test(url)
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : null
  })
}
