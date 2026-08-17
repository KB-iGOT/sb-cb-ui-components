import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core'

/**
 * Rendered inline by the page over its own backdrop instead of through MatDialog. Opening this as
 * a MatDialog moved the page behind it: the CDK overlay blocks scroll by switching the document to
 * `position: fixed; overflow-y: scroll`, and with `overflow: scroll` on the root the scrollbar
 * drops out of `100vw` — so the shell's content column (sized `calc(100vw - 88px)`) narrowed and
 * everything centred inside it slid left by half the scrollbar width. Owning the backdrop keeps the
 * document untouched, so the page stays exactly where it is.
 */
@Component({
  selector: 'ws-app-karma-redeem-dialog',
  templateUrl: './karma-redeem-dialog.component.html',
  styleUrls: ['./karma-redeem-dialog.component.scss'],
  standalone: false,
})
export class KarmaRedeemDialogComponent {

  @Input() data: any = {}
  /** true when the user confirms with "Continue", false on "Cancel", backdrop click or Escape. */
  @Output() closed = new EventEmitter<boolean>()

  get icon(): string {
    return this.data?.icon || '/assets/icons/home-v2/karma-badge.svg'
  }

  get header(): string {
    return this.data?.header || `You're all set! 🎉`
  }

  get message(): string {
    if (this.data?.message) {
      return this.data.message
    }
    const karmaCoins = this.data?.requiredKarmaPoints ?? 0
    return `Redeem ${karmaCoins} Karma Coins to unlock this course and start learning.`
  }

  get acceptButton(): string {
    return this.data?.acceptButton || 'Continue'
  }

  get cancelButton(): string {
    return this.data?.cancelButton || 'Cancel'
  }

  // Escape closed the dialog while MatDialog owned it; keep that behaviour.
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel()
  }

  onContinue(): void {
    this.closed.emit(true)
  }
  onCancel(): void {
    this.closed.emit(false)
  }
}
