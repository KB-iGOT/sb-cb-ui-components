import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentStripWithTabsPillsComponent } from './content-strip-with-tabs-pills.component';

describe('ContentStripWithTabsPillsComponent', () => {
  let component: ContentStripWithTabsPillsComponent;
  let fixture: ComponentFixture<ContentStripWithTabsPillsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentStripWithTabsPillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripWithTabsPillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
