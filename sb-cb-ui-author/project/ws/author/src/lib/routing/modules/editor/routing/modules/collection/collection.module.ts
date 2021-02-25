import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatTreeModule } from '@angular/material/tree'
import { CurateModule } from './../curate/curate.module'
import { UploadModule } from './../upload/upload.module'
import { CollectionRoutingModule } from './collection-routing.module'
import { AuthCollectionMatmenuComponent } from './components/auth-collection-matmenu/auth-collection-matmenu.component'
import { AuthEditorOptionsComponent } from './components/auth-editor-options/auth-editor-options.component'
import { AuthTableOfContentsComponent } from './components/auth-table-of-contents/auth-table-of-contents.component'
import { AuthTableTreeLabelComponent } from './components/auth-table-tree-label/auth-table-tree-label.component'
import { CollectionComponent } from './components/collection/collection.component'
import { WebPageModule } from '../web-page/web-page.module'
// import { IapAssessmentModule } from '../iap-assessment/iap-assessment.module'
import { QuizModule } from '../quiz/quiz.module'
import { SharedModule } from '../../../../../../modules/shared/shared.module'
import { EditorSharedModule } from '../../../shared/shared.module'
import { AuthViewerModule } from '../../../../../../modules/viewer/viewer.module'

@NgModule({
  declarations: [
    CollectionComponent,
    AuthTableOfContentsComponent,
    AuthEditorOptionsComponent,
    AuthTableTreeLabelComponent,
    AuthCollectionMatmenuComponent,
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    SharedModule,
    EditorSharedModule,
    MatTreeModule,
    DragDropModule,
    AuthViewerModule,
    UploadModule,
    CurateModule,
    WebPageModule,
    QuizModule,
  ],
})
export class CollectionModule { }
