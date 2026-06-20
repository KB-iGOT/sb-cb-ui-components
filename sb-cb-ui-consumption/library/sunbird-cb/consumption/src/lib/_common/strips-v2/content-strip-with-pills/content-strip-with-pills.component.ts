import { Component, input, signal, ChangeDetectionStrategy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PillConfig, ContentConfig } from '../models/content-section.model'
import { filterVisiblePills } from '../utils/visibility.util'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

@Component({
  selector: 'sb-uic-content-strip-with-pills',
  standalone: true,
  imports: [CommonModule, ContentStripsComponent],
  templateUrl: './content-strip-with-pills.component.html',
  styleUrl: './content-strip-with-pills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripWithPillsComponent {
  pills = input.required<PillConfig[]>();
  defaultPillKey = input<string>('');

  activePillKey = signal<string>('');

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
    })
  }

  selectPill(pillKey: string): void {
    this.activePillKey.set(pillKey)
  }

  isPillActive(pillKey: string): boolean {
    const active = this.activePillKey() || this.defaultPillKey()
    return active === pillKey
  }
}
