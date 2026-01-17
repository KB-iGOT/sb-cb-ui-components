import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'metaPipe',
    standalone: false
})
export class PipeMetaPipe implements PipeTransform {
  transform(val: any, pipes: any[]) {
    let result = val
    for (const pipe of pipes) {
      result = (new pipe()).transform(result)
    }
    return result
  }
}
