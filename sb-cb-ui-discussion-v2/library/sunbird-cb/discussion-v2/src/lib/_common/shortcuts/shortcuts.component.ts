import { Component, Input } from '@angular/core';

@Component({
    selector: 'd-v2-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.scss'],
    standalone: false
})
export class ShortcutsComponent {
  @Input() data: any = []

}
