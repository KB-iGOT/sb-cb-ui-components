import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AttendanceHelperComponent } from './attendance-helper.component'

describe('AttendanceHelperComponent', () => {
  let component: AttendanceHelperComponent
  let fixture: ComponentFixture<AttendanceHelperComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [AttendanceHelperComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceHelperComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
