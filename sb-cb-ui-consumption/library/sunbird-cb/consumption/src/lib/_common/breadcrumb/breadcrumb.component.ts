import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface IBreadcrumbItem {
  url?: string;
  title: string;
  icon?: string;
}

@Component({
  selector: 'sb-uic-breadcrumb',
  imports: [MatIconModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class BreadcrumbComponent {
  widgetData = input<IBreadcrumbItem[]>([]);

  readonly items = computed(() => this.widgetData() || []);

  isLast(index: number): boolean {
    return index === this.items().length - 1;
  }
}
