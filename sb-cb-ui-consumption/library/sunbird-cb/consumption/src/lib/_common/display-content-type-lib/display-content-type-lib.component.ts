import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '../../_models/widget-content.model'
import { MultilingualTranslationsService } from '../../_services/multilingual-translations.service'

@Component({
    selector: 'sb-uic-display-content-type',
    templateUrl: './display-content-type-lib.component.html',
    styleUrls: ['./display-content-type-lib.component.scss'],
    standalone: false
})
export class DisplayContentTypeLibComponent implements OnInit {
  @Input() useTranslation: boolean = true
  @Input() displayContentType: NsContent.EDisplayContentTypes = NsContent.EDisplayContentTypes.DEFAULT
  displayContentTypeEnum = NsContent.EDisplayContentTypes
  constructor(private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
