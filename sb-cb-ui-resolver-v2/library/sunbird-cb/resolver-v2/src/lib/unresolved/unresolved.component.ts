import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver } from '../sb-ui-resolver.model'
import { WidgetBaseComponent } from '../sb-ui-base.component'
@Component({
    selector: 'sb-ui-resolver-unresolved',
    templateUrl: './unresolved.component.html',
    styleUrls: ['./unresolved.component.scss'],
    standalone: false
})
export class UnresolvedComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: any
  showData = true
  previewMode = false
  searchArray = ['preview', 'channel']

  ngOnInit() {
    const url = window.location.href
    this.previewMode = this.searchArray.some((word: string) => {
      return url.indexOf(word) > -1
    })
  }
}
