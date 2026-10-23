import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NO_ERRORS_SCHEMA } from '@angular/core'

import { SupportAIComponent } from './support-ai.component';

describe('AiTutorComponent', () => {
  let component: SupportAIComponent;
  let fixture: ComponentFixture<SupportAIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportAIComponent],
      imports: [ HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule ],
      providers: [
        { provide: 'environment', useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    });
    fixture = TestBed.createComponent(SupportAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
