import { DatePipe } from '@angular/common'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'custumDateSortingPipe',
  standalone: false
})
export class CustumDateSortingPipePipe implements PipeTransform {

  transform(value: any) {
    // tslint:disable-next-line:no-parameter-reassignment
    const datePipe = new DatePipe('en-US')
    // tslint:disable-next-line:no-parameter-reassignment
    value = datePipe.transform(value, 'MMM dd, yyyy H:mm')
    return value
  }

}
