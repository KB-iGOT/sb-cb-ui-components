import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatTabsModule } from '@angular/material/tabs'
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module'
import { CalenderModule } from '../../calender/calender.module'
import { CardsModule } from '../../cards/cards.module'
import { CommonMethodsService } from '../../../_services/common-methods.service'
import { CommonStripModule } from '../../common-strip/common-strip.module'
import { CompetencyPassbookModule } from '../../competency-passbook/competency-passbook.module'
import { ContentStripWithTabsLibModule } from '../../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module'
import { DataPointsModule } from '../../data-points/data-points.module'
import { SlidersLibModule } from '../../sliders/sliders.module'
import { UserContentRatingLibModule } from '../../user-content-rating/user-content-rating-lib.module'
import { HttpLoaderFactory } from '../../http-loader-factory'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { ProvidersV2Component } from './providers-v2/providers-v2.component'
import { RouterModule } from '@angular/router'


@NgModule({
  declarations: [ProvidersV2Component],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    CalenderModule,
    CardsModule,
    CommonStripModule,
    CompetencyPassbookModule,
    UserContentRatingLibModule,
    ContentStripWithTabsLibModule,
    DataPointsModule,
    SlidersLibModule,
    MatTabsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [ProvidersV2Component],
  providers: [
    CommonMethodsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProvidersModule { }
