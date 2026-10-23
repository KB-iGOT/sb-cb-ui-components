import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'

import { ConnectionNameComponent } from './connection-name.component';

describe('ConnectionNameComponent', () => {
  let component: ConnectionNameComponent;
  let fixture: ComponentFixture<ConnectionNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionNameComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule ],
      providers: [
        DatePipe,
        { provide: 'environment', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(ConnectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
