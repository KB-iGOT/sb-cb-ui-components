import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationApprovalRequestFormComponent } from './designation-approval-request-form.component';

describe('DesignationApprovalRequestFormComponent', () => {
  let component: DesignationApprovalRequestFormComponent;
  let fixture: ComponentFixture<DesignationApprovalRequestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationApprovalRequestFormComponent]
    });
    fixture = TestBed.createComponent(DesignationApprovalRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
