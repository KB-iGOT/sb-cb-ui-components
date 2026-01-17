import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'objectToArray',
    standalone: false
})
export class ObjectToArrayPipe implements PipeTransform {
  // transform(value: any, ...args: any[]): any[] {
  //   if (!value) {
  //     return [];
  //   }

  //   return Object.keys(value).map(key => ({ key, value: value[key] }));
  // }
  transform(...args: any[]): any[] {
    return args
  }
}
