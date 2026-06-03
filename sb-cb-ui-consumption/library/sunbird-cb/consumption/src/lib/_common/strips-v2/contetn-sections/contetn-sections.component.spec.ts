import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContetnSectionsComponent } from './contetn-sections.component';

describe('ContetnSectionsComponent', () => {
  let component: ContetnSectionsComponent;
  let fixture: ComponentFixture<ContetnSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContetnSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContetnSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
