import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'mentionHighlight'
})
export class MentionHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    if (!value) {
      return ''
    }

    // Regular expression to find @mentions
    // This matches @ followed by word characters until a space or punctuation
    const mentionRegex = /(@\w+)/g

    // Replace mentions with span elements
    const transformedText = value.replace(
      mentionRegex,
      '<span class="mention" data-mention="$1">$1 </span>'
    )

    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.bypassSecurityTrustHtml(transformedText)
  }
}