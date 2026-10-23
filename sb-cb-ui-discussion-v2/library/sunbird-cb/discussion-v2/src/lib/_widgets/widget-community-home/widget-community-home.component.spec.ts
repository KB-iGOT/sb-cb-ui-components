import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { PipesModule } from '../../_pipes/pipes.module'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

import { WidgetCommunityHomeComponent } from './widget-community-home.component';

describe('WidgetCommunityHomeComponent', () => {
  let component: WidgetCommunityHomeComponent;
  let fixture: ComponentFixture<WidgetCommunityHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCommunityHomeComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, MatMenuModule , PipesModule , MatTooltipModule ],
      providers: [
        DatePipe,
        { provide: ConfigurationsService, useValue: { compentency: {} } },
        { provide: 'environment', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(WidgetCommunityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
