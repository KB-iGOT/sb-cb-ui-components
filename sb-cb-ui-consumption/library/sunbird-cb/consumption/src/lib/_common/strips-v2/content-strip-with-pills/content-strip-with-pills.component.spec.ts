import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStripWithPillsComponent } from './content-strip-with-pills.component';

describe('ContentStripWithPillsComponent', () => {
  let component: ContentStripWithPillsComponent;
  let fixture: ComponentFixture<ContentStripWithPillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentStripWithPillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentStripWithPillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
