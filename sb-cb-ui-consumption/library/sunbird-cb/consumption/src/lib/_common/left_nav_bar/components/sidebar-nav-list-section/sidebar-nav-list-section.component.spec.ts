import { SidebarNavListSectionComponent } from './sidebar-nav-list-section.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject, of } from 'rxjs'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any
const mockUtilitySvc = { setRouteData: jest.fn() } as any

describe('SidebarNavListSectionComponent', () => {
  let component: SidebarNavListSectionComponent
  let mockRouter: any

  const mockSection: any = {
    cardType: SidebarCardType.NAV_LIST,
    sectionTitle: 'Main Menu',
    collapsible: false,
    showViewAll: false,
    items: [
      { label: 'Home', navUrl: '/home', iconName: 'home', code: 'home' },
      { label: 'Profile', navUrl: '/profile', iconName: 'person', code: 'profile' },
      { label: 'Settings', navUrl: '/settings', iconUrl: 'settings-icon' }
    ]
  }

  beforeEach(() => {
    mockRouter = {
      events: of(),
      isActive: jest.fn().mockReturnValue(false),
      createUrlTree: jest.fn().mockReturnValue({}),
    }
    component = new SidebarNavListSectionComponent(mockRouter, mockTranslateService, mockLangtranslations, mockUtilitySvc)
    component.section = mockSection
    component.isOpen = true
    component.showContent = true
    component.ngOnChanges({
      section: { previousValue: undefined, currentValue: mockSection, firstChange: true, isFirstChange: () => true }
    } as any)
  })

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should accept section input', () => {
      expect(component.section).toBe(mockSection)
    })

    it('should accept isOpen input', () => {
      expect(component.isOpen).toBe(true)
    })

    it('should accept showContent input', () => {
      expect(component.showContent).toBe(true)
    })

    it('should have itemClicked event emitter', () => {
      expect(component.itemClicked).toBeDefined()
    })

    it('should accept activeItemCode input', () => {
      component.activeItemCode = 'home'
      expect(component.activeItemCode).toBe('home')
    })
  })

  describe('onItemClick', () => {
    it('should record route data and emit item code when item has code', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      const item: any = { label: 'Home', navUrl: '/home', code: 'home' }
      component.onItemClick(item)
      expect(mockUtilitySvc.setRouteData).toHaveBeenCalled()
      expect(spy).toHaveBeenCalledWith({ code: 'home', subType: '' })
    })

    it('should not emit when item has no code', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      const item: any = { label: 'Settings', navUrl: '/settings' }
      component.onItemClick(item)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('isActiveRoute', () => {
    it('should return false when item is undefined', () => {
      expect(component.isActiveRoute(undefined)).toBe(false)
    })

    it('should return false when navUrl is missing', () => {
      expect(component.isActiveRoute({ label: 'x' } as any)).toBe(false)
    })

    it('should call router.isActive with an exact match for items without queryParams', () => {
      mockRouter.isActive.mockReturnValue(true)
      const result = component.isActiveRoute({ label: 'Home', navUrl: '/home' } as any)
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/home'], {})
      expect(mockRouter.isActive).toHaveBeenCalledWith({}, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      })
      expect(result).toBe(true)
    })

    it('should match queryParams as a subset when the item declares them', () => {
      mockRouter.isActive.mockReturnValue(true)
      component.isActiveRoute({ label: 'Search', navUrl: '/search', queryParams: { tab: 'all' } } as any)
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/search'], { queryParams: { tab: 'all' } })
      expect(mockRouter.isActive).toHaveBeenCalledWith({}, expect.objectContaining({ queryParams: 'subset' }))
    })
  })

  describe('trackByNavUrl', () => {
    it('should return navUrl when it exists', () => {
      const item: any = { label: 'Home', navUrl: '/home' }
      const result = component.trackByNavUrl(0, item)
      expect(result).toBe('/home')
    })

    it('should return fallback string when navUrl is empty', () => {
      const item: any = { label: 'Test', navUrl: '' }
      const result = component.trackByNavUrl(3, item)
      expect(result).toBe('nav-item-3')
    })

    it('should use correct index in fallback', () => {
      const item: any = { label: 'Test', navUrl: '' }
      const result = component.trackByNavUrl(7, item)
      expect(result).toBe('nav-item-7')
    })
  })

  describe('translateLabels', () => {
    it('should delegate to MultilingualTranslationsService', () => {
      const result = component.translateLabels('Home', 'label')
      expect(mockLangtranslations.translateActualLabel).toHaveBeenCalledWith('Home', 'label', '')
      expect(result).toBe('Home')
    })
  })

  describe('ngOnDestroy', () => {
    it('should unsubscribe from internal subscriptions', () => {
      expect(() => component.ngOnDestroy()).not.toThrow()
    })
  })
})
