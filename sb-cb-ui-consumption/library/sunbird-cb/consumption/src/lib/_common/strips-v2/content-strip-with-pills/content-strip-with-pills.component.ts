import { Component, input, signal, ChangeDetectionStrategy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { PillConfig, ContentConfig } from '../models/content-section.model'
import { filterVisiblePills } from '../utils/visibility.util'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

@Component({
  selector: 'sb-uic-content-strip-with-pills',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, ContentStripsComponent],
  templateUrl: './content-strip-with-pills.component.html',
  styleUrls: ['./content-strip-with-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripWithPillsComponent {
  pills = input.required<PillConfig[]>();
  defaultPillKey = input<string>('');

  activePillKey = signal<string>('');
  showContent = signal<boolean>(false);

  visiblePills = computed(() => filterVisiblePills(this.pills()));

  activeContentConfig = computed<ContentConfig | null>(() => {
    const key = this.activePillKey() || this.defaultPillKey()
    const pill = this.visiblePills()?.find(p => p?.pillKey === key)
    return pill?.contentConfig ?? this.visiblePills()?.[0]?.contentConfig ?? null
  });

  constructor() {
    setTimeout(() => {
      if (!this.activePillKey()) {
        const defaultKey = this.defaultPillKey()
        if (defaultKey) {
          this.activePillKey.set(defaultKey)
        } else {
          const visible = this.visiblePills()
          if (visible?.length) {
            this.activePillKey.set(visible[0]?.pillKey ?? '')
          }
        }
      }
      this.showContent.set(true)
    })
  }

  selectPill(pillKey: string): void {
    this.showContent.set(false)
    this.activePillKey.set(pillKey)
    setTimeout(() => this.showContent.set(true))
  }

  isPillActive(pillKey: string): boolean {
    const active = this.activePillKey() || this.defaultPillKey()
    return active === pillKey
  }

  /**
   * The pill card is a fixed 254px, so its label and description lines are clipped with an
   * ellipsis. Used to enable the tooltip only for the lines that are actually cut off, so hovering
   * fully visible text stays quiet.
   */
  isTextTruncated(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth
  }

  getActivePill(): PillConfig | undefined {
    const active = this.activePillKey() || this.defaultPillKey()
    return this.visiblePills()?.find(p => p?.pillKey === active)
  }
}
