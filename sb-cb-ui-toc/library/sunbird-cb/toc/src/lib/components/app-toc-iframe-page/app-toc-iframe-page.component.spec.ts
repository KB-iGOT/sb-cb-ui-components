import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppTocIframePageComponent } from './app-toc-iframe-page.component';

describe('AppTocIframePageComponent', () => {
  let component: AppTocIframePageComponent;
  let fixture: ComponentFixture<AppTocIframePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTocIframePageComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTocIframePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
