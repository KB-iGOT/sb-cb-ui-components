import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { PillsComponent } from './pills.component'
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module'



@NgModule({
  declarations: [PillsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule
  ],
  exports: [PillsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PillsModule { }
