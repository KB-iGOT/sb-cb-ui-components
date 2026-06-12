import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCbpComponent } from './ai-cbp.component';

describe('AiCbpComponent', () => {
  let component: AiCbpComponent;
  let fixture: ComponentFixture<AiCbpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiCbpComponent]
    });
    fixture = TestBed.createComponent(AiCbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
