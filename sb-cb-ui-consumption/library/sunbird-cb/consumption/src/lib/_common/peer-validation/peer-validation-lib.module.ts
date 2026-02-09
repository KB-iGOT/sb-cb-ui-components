import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PvDashboardComponent } from './component/pv-dashboard/pv-dashboard.component'



@NgModule({
  declarations: [
    PvDashboardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PvDashboardComponent
  ]
})
export class PeerValidationLibModule { }
