import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver } from '../sb-ui-resolver.model'
import { WidgetBaseComponent } from '../sb-ui-base.component'
@Component({
    selector: 'sb-ui-resolver-invalid-registration',
    templateUrl: './invalid-registration.component.html',
    styleUrls: ['./invalid-registration.component.scss'],
    standalone: false
})
export class InvalidRegistrationComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: any
  showData = true
  ngOnInit() {}
}
