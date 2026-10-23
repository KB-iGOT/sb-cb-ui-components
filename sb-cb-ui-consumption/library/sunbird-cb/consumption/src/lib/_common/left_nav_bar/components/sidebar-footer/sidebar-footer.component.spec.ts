import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarFooterComponent } from './sidebar-footer.component';

describe('SidebarFooterComponent', () => {
  let component: SidebarFooterComponent;
  let fixture: ComponentFixture<SidebarFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFooterComponent, TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
