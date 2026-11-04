import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const MARKETPLACE_ALERT_PANEL_CLASS = 'marketplace-alert-panel'

export interface MarketplaceCountRow {
  name?: string
  marketplace: number
  free: number
  paid: number
}

export interface MarketplaceCoursesAlertData {
  // One row per designation; the Total row is shown only when there is more than one
  rows: MarketplaceCountRow[]
  confirmLabel?: string
}

/**
 * Confirmation shown before saving / sending courses for approval when marketplace courses are included.
 * Closes with `true` only when the user acknowledges and confirms.
 */
@Component({
  selector: 'app-marketplace-courses-alert',
  templateUrl: './marketplace-courses-alert.component.html',
  styleUrls: ['./marketplace-courses-alert.component.scss'],
  // Unscoped so the dialog surface can be styled via MARKETPLACE_ALERT_PANEL_CLASS; all classes are mkt- prefixed
  encapsulation: ViewEncapsulation.None
})
export class MarketplaceCoursesAlertComponent {
  rows: MarketplaceCountRow[] = []
  total: MarketplaceCountRow = { marketplace: 0, free: 0, paid: 0 }
  confirmLabel = 'Proceed'
  acknowledged = false

  constructor(
    public dialogRef: MatDialogRef<MarketplaceCoursesAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MarketplaceCoursesAlertData
  ) {
    this.rows = (data?.rows || []).filter(row => row.marketplace > 0)
    this.confirmLabel = data?.confirmLabel || this.confirmLabel
    this.rows.forEach(row => {
      this.total.marketplace += row.marketplace
      this.total.free += row.free
      this.total.paid += row.paid
    })
  }

  confirm() {
    if (this.acknowledged) {
      this.dialogRef.close(true)
    }
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
