import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CardResourceComponent } from './card-resource/card-resource.component';
import { CardsComponent } from './cards.component';
import { CardPortraitComponent } from './card-portrait/card-portrait.component';
import { PipePublicURLModule } from '../../_pipes/pipe-public-URL/pipe-public-URL.module';
import { ObjectToArrayPipeModule } from '../../_pipes/object-to-array/object-to-array.pipe.module';
import { DisplayContentTypeLibModule } from '../display-content-type-lib/display-content-type-lib.module';
import { DefaultThumbnailModule } from '../../_directives/default-thumbnail/default-thumbnail.module';
import { PipeDurationTransformModule } from '../../_pipes/pipe-duration-transform/pipe-duration-transform.module';
import { CardUserComponent } from './card-user/card-user.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { CardLandscapeComponent } from './card-landscape/card-landscape.component';
import { CardWideComponent } from './card-wide/card-wide.component';
import { CardMDOChannelComponent } from './card-mdo-channel/card-mdo-channel.component';
import { CardWideV2Component } from './card-wide-v2/card-wide-v2.component';
import { CardKarmaProgramsComponent } from './card-karma-programs/card-karma-programs.component';
import { CardKarmaProgramsV2Component } from './card-karma-programs-v2/card-karma-programs-v2.component';
import { CardPortraitExtComponent } from './card-portrait-ext/card-portrait-ext.component';
import { CardAssessmentComponent } from './card-assessment/card-assessment/card-assessment.component';
import { CardProgressPortraitLibComponent } from './card-progress-portrait-lib/card-progress-portrait-lib.component';
// import { ContentProgressComponent } from './content-progress/content-progress.component';
import { ContentProgressModule } from './../content-progress/content-progress.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    CardResourceComponent,
    CardsComponent,CardPortraitComponent,
    CardUserComponent,
    CardLandscapeComponent,
    CardWideComponent,
    CardMDOChannelComponent,
    CardWideV2Component,
    CardKarmaProgramsComponent,
    CardKarmaProgramsV2Component,
    CardPortraitExtComponent,
    CardAssessmentComponent,
    CardProgressPortraitLibComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    PipePublicURLModule,
    ObjectToArrayPipeModule,
    DisplayContentTypeLibModule,
    DefaultThumbnailModule,
    PipeDurationTransformModule,
    SkeletonLoaderLibModule,
    MatProgressSpinnerModule,
    ContentProgressModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents:[CardsComponent],
  exports: [
    CardsComponent,
    CardResourceComponent,
    CardPortraitComponent, 
    CardLandscapeComponent,
    CardUserComponent,
    CardWideComponent,
    CardMDOChannelComponent,
    CardWideV2Component,
    CardKarmaProgramsComponent,
    CardKarmaProgramsV2Component,
    
  ],
})
export class CardsModule { }
