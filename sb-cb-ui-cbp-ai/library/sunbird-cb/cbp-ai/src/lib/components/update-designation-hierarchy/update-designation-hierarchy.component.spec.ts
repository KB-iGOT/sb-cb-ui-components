import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDesignationHierarchyComponent } from './update-designation-hierarchy.component';

describe('UpdateDesignationHierarchyComponent', () => {
  let component: UpdateDesignationHierarchyComponent;
  let fixture: ComponentFixture<UpdateDesignationHierarchyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDesignationHierarchyComponent]
    });
    fixture = TestBed.createComponent(UpdateDesignationHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
