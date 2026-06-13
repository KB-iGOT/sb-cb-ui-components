import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRequestFormComponent } from './approval-request-form.component';

describe('ApprovalRequestFormComponent', () => {
  let component: ApprovalRequestFormComponent;
  let fixture: ComponentFixture<ApprovalRequestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalRequestFormComponent]
    });
    fixture = TestBed.createComponent(ApprovalRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
