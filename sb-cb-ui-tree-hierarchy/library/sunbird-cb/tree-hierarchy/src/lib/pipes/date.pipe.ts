import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'date',
    standalone: false
})
export class DatePipe implements PipeTransform {

  transform(value: any): any {
    return new Date(value).toLocaleString().split(',')[0]
  }

}
