import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { TrainingPlanComponent } from './training-plan.component';

// Modules
import { RoleMappingModule } from './_modules/role-mapping/role-mapping.module';
import { CreateTrainingPlanModule } from './_modules/create-training-plan/create-training-plan.module';

@NgModule({
  declarations: [
    TrainingPlanComponent
  ],
  imports: [
    CommonModule,
    RoleMappingModule,
    CreateTrainingPlanModule
  ],
  exports: [
    TrainingPlanComponent,
    RoleMappingModule,
    CreateTrainingPlanModule
  ]
})
export class SunbirdCbTrainingPlanModule { }