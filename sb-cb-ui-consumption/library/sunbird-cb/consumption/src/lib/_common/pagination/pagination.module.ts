import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { PaginationComponent } from "./pagination.component"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"

@NgModule({
  declarations: [PaginationComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  exports: [PaginationComponent],
})
export class PaginationModule { }
