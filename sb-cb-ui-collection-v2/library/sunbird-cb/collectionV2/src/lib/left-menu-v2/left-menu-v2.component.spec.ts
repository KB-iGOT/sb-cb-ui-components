import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { LeftMenuV2Component } from './left-menu-v2.component';

describe('LeftMenuV2Component', () => {
  let component: LeftMenuV2Component;
  let fixture: ComponentFixture<LeftMenuV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftMenuV2Component ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftMenuV2Component);
    component = fixture.componentInstance;
    component.widgetData = {} as any
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
