
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-uic-ai-program',
  templateUrl: './ai-program.component.html',
  styleUrls: ['./ai-program.component.scss'],
})
export class AiProgramComponent {
  @Input() programData: any
}
