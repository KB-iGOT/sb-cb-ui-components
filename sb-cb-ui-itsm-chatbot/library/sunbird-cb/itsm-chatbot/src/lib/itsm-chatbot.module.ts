import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SupportAIComponent } from './support-ai/support-ai.component'
import { WebSocketService } from './support-ai/socket.service'
import { SupportAiService } from './support-ai/support-ai.service'

@NgModule({
  declarations: [
    SupportAIComponent
  ],
  imports: [CommonModule],
  exports: [SupportAIComponent],
  providers: [WebSocketService, SupportAiService]
})
export class ItsmChatModule {

}
