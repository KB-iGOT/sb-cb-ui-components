import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { ListTableComponent } from './list-table.component';

describe('ListTableComponent', () => {
  let component: ListTableComponent;
  let fixture: ComponentFixture<ListTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LiveAnnouncer, useValue: { announce: jest.fn() } }
      ]
    });
    fixture = TestBed.createComponent(ListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
