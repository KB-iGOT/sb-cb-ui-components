import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AccessControlGuideComponent } from './access-control-guide.component';
import { AccessControlService } from '../../../_services/access-control.service';

describe('AccessControlGuideComponent', () => {
  let component: AccessControlGuideComponent;
  let fixture: ComponentFixture<AccessControlGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccessControlGuideComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    });
    TestBed.inject(AccessControlService).accessControlConfig.set({} as any);
    fixture = TestBed.createComponent(AccessControlGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
