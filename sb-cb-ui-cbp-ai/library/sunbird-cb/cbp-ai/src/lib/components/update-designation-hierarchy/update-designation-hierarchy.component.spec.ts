import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateDesignationHierarchyComponent } from './update-designation-hierarchy.component';

describe('UpdateDesignationHierarchyComponent', () => {
  let component: UpdateDesignationHierarchyComponent;
  let fixture: ComponentFixture<UpdateDesignationHierarchyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UpdateDesignationHierarchyComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UpdateDesignationHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
