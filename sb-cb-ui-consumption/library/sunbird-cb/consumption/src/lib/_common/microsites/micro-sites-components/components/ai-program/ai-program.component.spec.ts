import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiProgramComponent } from './ai-program.component';

describe('AiProgramComponent', () => {
  let component: AiProgramComponent;
  let fixture: ComponentFixture<AiProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiProgramComponent]
    });
    fixture = TestBed.createComponent(AiProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
