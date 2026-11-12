import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProviderCardComponent } from './provider-card.component';

jest.mock('../../../_services/widget-content-lib.service', () => ({
  WidgetContentLibService: jest.fn().mockImplementation(() => ({})),
}))

describe('ProviderCardComponent', () => {
  let component: ProviderCardComponent;
  let fixture: ComponentFixture<ProviderCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ProviderCardComponent showKarmaCoinsBadge', () => {
  const cardFor = (content: any) => {
    const card = new ProviderCardComponent({} as any, {} as any)
    card.widgetData = content === undefined ? undefined as any : { content } as any
    return card
  }

  it('should show for a Course licence provider with karma points enabled', () => {
    expect(cardFor({ licenseType: 'Course', addKarmaPointEnabled: true }).showKarmaCoinsBadge).toBe(true)
  })

  it('should match the Course licence type case-insensitively', () => {
    expect(cardFor({ licenseType: 'course', addKarmaPointEnabled: true }).showKarmaCoinsBadge).toBe(true)
    expect(cardFor({ licenseType: 'COURSE', addKarmaPointEnabled: true }).showKarmaCoinsBadge).toBe(true)
    expect(cardFor({ licenseType: ' Course ', addKarmaPointEnabled: true }).showKarmaCoinsBadge).toBe(true)
  })

  it('should hide for a User licence provider even with karma points enabled', () => {
    expect(cardFor({ licenseType: 'User', addKarmaPointEnabled: true }).showKarmaCoinsBadge).toBe(false)
  })

  it('should hide when karma points are not enabled', () => {
    expect(cardFor({ licenseType: 'Course' }).showKarmaCoinsBadge).toBe(false)
    expect(cardFor({ licenseType: 'Course', addKarmaPointEnabled: false }).showKarmaCoinsBadge).toBe(false)
    expect(cardFor({ licenseType: 'Course', addKarmaPointEnabled: null }).showKarmaCoinsBadge).toBe(false)
  })

  it('should no longer read requiredKarmaCoins', () => {
    expect(cardFor({ licenseType: 'Course', requiredKarmaCoins: 50 }).showKarmaCoinsBadge).toBe(false)
  })

  it('should no longer key off the simplilearn name', () => {
    expect(cardFor({ name: 'SIMPLILEARN', licenseType: 'User' }).showKarmaCoinsBadge).toBe(false)
  })

  it('should hide when there is no widget data', () => {
    expect(cardFor(undefined).showKarmaCoinsBadge).toBe(false)
  })
});
