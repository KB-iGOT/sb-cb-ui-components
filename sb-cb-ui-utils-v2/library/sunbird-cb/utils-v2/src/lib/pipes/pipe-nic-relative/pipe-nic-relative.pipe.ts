import { Inject, Pipe, PipeTransform } from '@angular/core'
@Pipe({
    name: 'PipeNicRelative',
    standalone: false
})
export class PipeNicRelativePipe implements PipeTransform {
  environment: any
  constructor(@Inject('environment') environment: any) {
    this.environment = environment
  }
  transform(value: any): string {
    return value ? this.generateUrl(value) : ''

  }

  generateUrl(oldUrl: string) {
    const chunk = oldUrl ? oldUrl.split('/') : []
    const newChunk = this.environment.azureHost.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(this.environment.azureBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
  }
}
