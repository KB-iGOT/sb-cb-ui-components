import { Directive, Input, ViewContainerRef, OnChanges } from '@angular/core'
import { LoggerService } from '@sunbird-cb/utils-v2'
import { NsWidgetResolver } from './sb-ui-resolver.model'
import { SbUiResolverService } from './sb-ui-resolver.service'

@Directive({
    selector: '[sbUiResolverWidget]',
    standalone: false
})
export class SbUiResolverDirective implements OnChanges {
  @Input() sbUiResolverWidget: NsWidgetResolver.IRenderConfigWithAnyData | null = null
  constructor(
    private viewContainerRef: ViewContainerRef,
    private widgetResolverSvc: SbUiResolverService,
    private logger: LoggerService,
  ) {}

  ngOnChanges() {
    if (!this.widgetResolverSvc.isInitialized) {
      this.logger.error(
        'Widgets Registration Not Done. Used Before Initialization.',
        this.sbUiResolverWidget,
      )
      return
    }
    if (this.sbUiResolverWidget) {
      const compRef = this.widgetResolverSvc.resolveWidget(
        this.sbUiResolverWidget,
        this.viewContainerRef,
      )
      if (compRef) {
        compRef.changeDetectorRef.detectChanges()
      }
    }
  }
}
