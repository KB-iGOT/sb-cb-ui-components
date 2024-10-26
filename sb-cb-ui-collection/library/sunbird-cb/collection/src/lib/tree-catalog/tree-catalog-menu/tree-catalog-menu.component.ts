import { Component, ViewChild, ElementRef, Input } from '@angular/core'
import { TFetchStatus } from '@sunbird-cb/utils'
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu'
import { NSSearch } from '../../_services/widget-search.model'

@Component({
  selector: 'ws-widget-tree-catalog-menu',
  templateUrl: './tree-catalog-menu.component.html',
  styleUrls: ['./tree-catalog-menu.component.scss'],
})
export class TreeCatalogMenuComponent {

  @ViewChild('childMenu', { static: true }) public childMenu!: ElementRef

  @Input() rootTrigger: MatMenuTrigger | null = null
  @Input() catalogItems: NSSearch.IFilterUnitContent[] | null = null
  @Input() fetchStatus: TFetchStatus = 'none'
  @Input() isRoot = false

}
