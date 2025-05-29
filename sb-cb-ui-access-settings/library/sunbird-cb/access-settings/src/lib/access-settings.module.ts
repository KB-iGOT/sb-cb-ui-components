import { NgModule } from "@angular/core";
import { AccessSettingsComponent } from "./access-settings.component";
import { BulkUploadKarmayogiComponent } from "./components/bulk-upload-karmayogi/bulk-upload-karmayogi.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";

@NgModule({
  declarations: [AccessSettingsComponent, SnackbarComponent],
  imports: [],
  exports: [AccessSettingsComponent],
})
export class AccessSettingsModule {}
export * from "./access-settings.component";
