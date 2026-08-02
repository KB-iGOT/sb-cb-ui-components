import { Component, input, signal, ChangeDetectionStrategy, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PillConfig, ContentConfig, ContentSectionConfig } from '../models/content-section.model'
import { filterVisiblePills } from '../utils/visibility.util'
import { ContentStripsComponent } from '../content-strips/content-strips.component'

@Component({
  selector: 'sb-uic-content-strip-with-pills',
  standalone: true,
  imports: [CommonModule, ContentStripsComponent],
  templateUrl: './content-strip-with-pills.component.html',
  styleUrls: ['./content-strip-with-pills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripWithPillsComponent {
  pills = input.required<PillConfig[]>();
  defaultPillKey = input<string>('');
  section = input<ContentSectionConfig>();

  activePillKey = signal<string>('');
  showContent = signal<boolean>(false);

  visiblePills = computed(() => filterVisiblePills(this.pills()));

  activeContentConfig = computed<ContentConfig | null>(() => {
    const key = this.activePillKey() || this.defaultPillKey()
    const pill = this.findPill(key)
    return pill?.contentConfig ?? this.visiblePills()?.[0]?.contentConfig ?? null
  });

  constructor() {
    setTimeout(() => {
      if (!this.activePillKey()) {
        const defaultKey = this.defaultPillKey()
        if (defaultKey) {
          const pill = this.findPill(defaultKey)
          this.activePillKey.set(pill?.pillKey ?? defaultKey)
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
    const pill = this.visiblePills()?.find(p => p?.pillKey === pillKey)
    return active === pillKey || (!!pill && pill.pillLabel === active)
  }

  getActivePill(): PillConfig | undefined {
    const active = this.activePillKey() || this.defaultPillKey()
    return this.findPill(active)
  }

  private findPill(keyOrLabel: string): PillConfig | undefined {
    if (!keyOrLabel) {
      return undefined
    }
    return this.visiblePills()?.find(p => p?.pillKey === keyOrLabel || p?.pillLabel === keyOrLabel)
  }
}
