import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTrainingPlanComponent } from './create-training-plan.component';
import { RoleMappingModule } from '../role-mapping/role-mapping.module';



@NgModule({
  declarations: [
    CreateTrainingPlanComponent
  ],
  imports: [
    CommonModule,
    RoleMappingModule
  ],
  exports: [
    CreateTrainingPlanComponent
  ]
})
export class CreateTrainingPlanModule { }
