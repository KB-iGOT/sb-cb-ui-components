import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { MatRadioModule } from '@angular/material/radio'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

// Local pipe imports
import { OrderByPipeModule } from '../../_pipes/order-by/order-by.pipe.module'

// Component import
import { CompetencyListComponent } from './competency-list/competency-list.component'

@NgModule({
  declarations: [
    CompetencyListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    OrderByPipeModule
  ],
  exports: [
    CompetencyListComponent
  ]
})
export class CompetenciesModule { }
