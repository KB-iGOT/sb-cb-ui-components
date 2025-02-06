import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeRelativeTimePipe } from './pipe-relative-time/pipe-relative-time.pipe';
import { NumberShortenerPipe } from './number-shortener/number-shortener.pipe';
import { FilterSearchPipe } from './filter-search/filter-search.pipe';


@NgModule({
  declarations: [PipeRelativeTimePipe, NumberShortenerPipe, FilterSearchPipe],
  imports: [
    CommonModule,
  ],
  exports: [PipeRelativeTimePipe,  NumberShortenerPipe, FilterSearchPipe],
})
export class PipesModule { }
