import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver } from '../sb-ui-resolver.model'
import { WidgetBaseComponent } from '../sb-ui-base.component'
@Component({
    selector: 'sb-ui-resolver-invalid-permission',
    templateUrl: './invalid-permission.component.html',
    styleUrls: ['./invalid-permission.component.scss'],
    standalone: false
})
export class InvalidPermissionComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetType!: string
  @Input() widgetSubType!: string
  @Input() widgetInstanceId?: string
  @Input() widgetData!: any
  showData = true

  ngOnInit() {}
}
