import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BulkUploadKarmayogiComponent } from './bulk-upload-karmayogi.component';
import { AccessControlService } from '../../_services/access-control.service';

describe('BulkUploadKarmayogiComponent', () => {
  let component: BulkUploadKarmayogiComponent;
  let fixture: ComponentFixture<BulkUploadKarmayogiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BulkUploadKarmayogiComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.inject(AccessControlService).accessControlConfig.set({} as any);
    fixture = TestBed.createComponent(BulkUploadKarmayogiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
