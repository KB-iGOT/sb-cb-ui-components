import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeRelativeTimePipe } from './pipe-relative-time/pipe-relative-time.pipe';
import { NumberShortenerPipe } from './number-shortener/number-shortener.pipe';


@NgModule({
  declarations: [PipeRelativeTimePipe, NumberShortenerPipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeRelativeTimePipe,  NumberShortenerPipe],
})
export class PipesModule { }
