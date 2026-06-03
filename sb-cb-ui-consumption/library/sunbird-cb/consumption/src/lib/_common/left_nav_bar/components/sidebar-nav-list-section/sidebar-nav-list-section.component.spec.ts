import { SidebarNavListSectionComponent } from './sidebar-nav-list-section.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject } from 'rxjs'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any

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
      isActive: jest.fn().mockReturnValue(false)
    }
    component = new SidebarNavListSectionComponent(mockRouter, mockTranslateService, mockLangtranslations)
    component.section = mockSection
    component.isOpen = true
    component.showContent = true
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
    it('should emit item code when item has code', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      const item: any = { label: 'Home', navUrl: '/home', code: 'home' }
      component.onItemClick(item)
      expect(spy).toHaveBeenCalledWith('home')
    })

    it('should not emit when item has no code', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      const item: any = { label: 'Settings', navUrl: '/settings' }
      component.onItemClick(item)
      expect(spy).not.toHaveBeenCalled()
    })

    it('should not emit when item is null', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      component.onItemClick(null as any)
      expect(spy).not.toHaveBeenCalled()
    })

    it('should not emit when item code is empty string', () => {
      const spy = jest.spyOn(component.itemClicked, 'emit')
      const item: any = { label: 'Test', navUrl: '/test', code: '' }
      component.onItemClick(item)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('isActiveRoute', () => {
    it('should return false when navUrl is undefined', () => {
      const result = component.isActiveRoute(undefined)
      expect(result).toBe(false)
    })

    it('should return false when navUrl is empty string', () => {
      const result = component.isActiveRoute('')
      expect(result).toBe(false)
    })

    it('should call router.isActive with correct parameters', () => {
      mockRouter.isActive.mockReturnValue(true)
      const result = component.isActiveRoute('/home')
      expect(mockRouter.isActive).toHaveBeenCalledWith('/home', {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
      })
      expect(result).toBe(true)
    })

    it('should return false when route is not active', () => {
      mockRouter.isActive.mockReturnValue(false)
      const result = component.isActiveRoute('/other')
      expect(result).toBe(false)
    })

    it('should return true when route is active', () => {
      mockRouter.isActive.mockReturnValue(true)
      const result = component.isActiveRoute('/profile')
      expect(result).toBe(true)
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

    it('should return fallback string when navUrl is undefined', () => {
      const item: any = { label: 'Test' }
      const result = component.trackByNavUrl(1, item)
      expect(result).toBe('nav-item-1')
    })

    it('should use correct index in fallback', () => {
      const item: any = { label: 'Test', navUrl: '' }
      const result = component.trackByNavUrl(7, item)
      expect(result).toBe('nav-item-7')
    })
  })
})
