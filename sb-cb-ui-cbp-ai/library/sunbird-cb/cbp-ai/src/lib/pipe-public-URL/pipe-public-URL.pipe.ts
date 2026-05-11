import { Pipe,  PipeTransform } from '@angular/core'

import { SharedService } from '../modules/shared/services/shared.service';
@Pipe({
    name: 'pipePublicURL',
    standalone: false
})
export class PipePublicURL implements PipeTransform {
  constructor(  private sharedSvc: SharedService, ) {

  }
  transform(value: string): any {
    let configDetails = this.sharedSvc.getConfig();
    const mainUrl = value && value.split('/content').pop() || ''
    const finalURL = `${configDetails.portalURL}/${configDetails.contentBucket}/content${mainUrl}`
    return value ? finalURL : ''
  }

}
