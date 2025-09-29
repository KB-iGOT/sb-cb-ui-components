import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Module
import { MaterialsModule } from '../../_common/materials/materials.module';

// Components
import { RoleMappingComponent } from './role-mapping.component';

// Services
import { RoleMappingService } from './services/role-mapping.service';

@NgModule({
  declarations: [
    RoleMappingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialsModule
  ],
  providers: [
    RoleMappingService
  ],
  exports: [
    RoleMappingComponent
  ]
})
export class RoleMappingModule { }