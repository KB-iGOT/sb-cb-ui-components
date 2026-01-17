import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver } from '../sb-ui-resolver.model'
import { WidgetBaseComponent } from '../sb-ui-base.component'
@Component({
    selector: 'sb-ui-resolver-restricted',
    templateUrl: './restricted.component.html',
    styleUrls: ['./restricted.component.scss'],
    standalone: false
})
export class RestrictedComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: any
  showData = true

  ngOnInit() {}
}
