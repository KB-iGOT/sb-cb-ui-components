import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'

import { WidgetDiscussionv2HomeComponent } from './widget-discussionv2-home.component';

describe('WidgetDiscussionv2HomeComponent', () => {
  let component: WidgetDiscussionv2HomeComponent;
  let fixture: ComponentFixture<WidgetDiscussionv2HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDiscussionv2HomeComponent ],
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
    fixture = TestBed.createComponent(WidgetDiscussionv2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
