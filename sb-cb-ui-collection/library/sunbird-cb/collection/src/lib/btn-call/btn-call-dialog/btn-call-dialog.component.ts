import { Component, OnInit, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
// import { EventService } from '@sunbird-cb/utils'

export interface IWidgetBtnCallDialogData {
  name: string
  phone: string
}

@Component({
  selector: 'ws-widget-btn-call-dialog',
  templateUrl: './btn-call-dialog.component.html',
  styleUrls: ['./btn-call-dialog.component.scss'],
})
export class BtnCallDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    // private events: EventService,
    @Inject(MAT_DIALOG_DATA) public data: IWidgetBtnCallDialogData,
  ) { }

  ngOnInit() {
  }

  copyToClipboard(successMsg: string) {
    const textArea = document.createElement('textarea')
    textArea.value = this.data.phone
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    this.snackBar.open(`${this.data.phone} : ${successMsg}`, 'X')
    // this.raiseTelemetry('copyToClipboard')
  }

  raiseTelemetry(_subType: 'copyToClipboard' | 'callSME') {
    // this.events.raiseInteractTelemetry(
    //   'call',
    //   subType,
    //   {
    //     name: this.data.name,
    //     phone: this.data.phone,
    //   },
    // )
  }

}
