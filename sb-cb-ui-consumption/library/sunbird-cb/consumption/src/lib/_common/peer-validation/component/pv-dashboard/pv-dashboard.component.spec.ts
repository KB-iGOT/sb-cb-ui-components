import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { LOADER_SERVICE } from '../../service/loader-service.token'

import { PvDashboardComponent } from './pv-dashboard.component';

describe('PvDashboardComponent', () => {
  let component: PvDashboardComponent;
  let fixture: ComponentFixture<PvDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PvDashboardComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule ],
      providers: [
        DatePipe,
        { provide: LOADER_SERVICE, useValue: { changeLoaderState: () => undefined } },
        { provide: 'environment', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(PvDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
