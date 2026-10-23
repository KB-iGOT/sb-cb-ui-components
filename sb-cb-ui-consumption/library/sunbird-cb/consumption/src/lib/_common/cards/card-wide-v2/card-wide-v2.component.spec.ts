import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { PipePublicURLModule } from '@sunbird-cb/utils-v2'

import { CardWideV2Component } from './card-wide-v2.component';

describe('CardWideV2Component', () => {
  let component: CardWideV2Component;
  let fixture: ComponentFixture<CardWideV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardWideV2Component ],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, PipePublicURLModule ],
      providers: [
        DatePipe,
        { provide: 'environment', useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWideV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
