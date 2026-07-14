import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SupportAIComponent } from './support-ai/support-ai.component'
import { WebSocketService } from './support-ai/socket.service'
import { SupportAiService } from './support-ai/support-ai.service'
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MarkdownModule } from 'ngx-markdown'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { ScrollingModule } from '@angular/cdk/scrolling'

@NgModule({
  declarations: [
    SupportAIComponent
  ],
  imports: [CommonModule,
FormsModule,
MatIconModule,
MatTooltipModule,
ScrollingModule,
  MarkdownModule,
  PipeDurationTransformModule],
  exports: [SupportAIComponent],
  providers: [WebSocketService, SupportAiService]
})
export class ItsmChatModule {

}
