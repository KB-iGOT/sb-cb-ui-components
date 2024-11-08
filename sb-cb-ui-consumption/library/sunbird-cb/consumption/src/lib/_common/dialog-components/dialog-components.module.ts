import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateDialogComponent } from './certificate-dialog/certificate-dialog.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { HttpClient } from '@angular/common/http';
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2';



@NgModule({
    declarations: [
        CertificateDialogComponent
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        PipeSafeSanitizerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [
        CertificateDialogComponent
    ]
})
export class DialogComponentsModule { }
