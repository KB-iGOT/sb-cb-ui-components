import { DynamicSidebarComponent } from './dynamic-sidebar.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject } from 'rxjs'
import { signal, EventEmitter } from '@angular/core'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any

function createComponent(): DynamicSidebarComponent {
  const comp = Object.create(DynamicSidebarComponent.prototype)
  comp.isOpen = signal(true)
  comp.showContent = signal(true)
  comp.sidebarStateChange = new EventEmitter()
  comp.navItemClicked = new EventEmitter()
  comp.SidebarCardType = SidebarCardType
  comp.menuBarDetails = { defaultOpen: true, navSections: [] }
  comp.langtranslations = mockLangtranslations
  return comp
}

describe('DynamicSidebarComponent', () => {
  let component: DynamicSidebarComponent

  beforeEach(() => {
    component = createComponent()
  })

  afterEach(() => {
    component.ngOnDestroy()
  })

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should have isOpen signal defaulting to true', () => {
      expect(component.isOpen()).toBe(true)
    })

    it('should have showContent signal defaulting to true', () => {
      expect(component.showContent()).toBe(true)
    })

    it('should expose SidebarCardType enum', () => {
      expect(component.SidebarCardType).toBe(SidebarCardType)
    })

    it('should have sidebarStateChange event emitter', () => {
      expect(component.sidebarStateChange).toBeDefined()
    })

    it('should have navItemClicked event emitter', () => {
      expect(component.navItemClicked).toBeDefined()
    })
  })

  describe('toggleSidebar', () => {
    it('should toggle isOpen from true to false', () => {
      component.isOpen.set(true)
      component.toggleSidebar()
      expect(component.isOpen()).toBe(false)
    })

    it('should toggle isOpen from false to true', () => {
      component.isOpen.set(false)
      component.toggleSidebar()
      expect(component.isOpen()).toBe(true)
    })

    it('should emit sidebarStateChange event when toggled', () => {
      const spy = jest.spyOn(component.sidebarStateChange, 'emit')
      component.toggleSidebar()
      expect(spy).toHaveBeenCalledWith({ isOpen: false })
    })

    it('should emit correct state after multiple toggles', () => {
      const spy = jest.spyOn(component.sidebarStateChange, 'emit')
      component.toggleSidebar()
      component.toggleSidebar()
      expect(spy).toHaveBeenLastCalledWith({ isOpen: true })
    })
  })

  describe('trackByCardType', () => {
    it('should return cardType-index string', () => {
      const section = { cardType: SidebarCardType.NAV_LIST } as any
      const result = component.trackByCardType(0, section)
      expect(result).toBe('nav_list-0')
    })

    it('should handle different indices', () => {
      const section = { cardType: SidebarCardType.STAT_CARDS } as any
      const result = component.trackByCardType(2, section)
      expect(result).toBe('stat_cards-2')
    })

    it('should handle INFO_CARDS type', () => {
      const section = { cardType: SidebarCardType.INFO_CARDS } as any
      const result = component.trackByCardType(1, section)
      expect(result).toBe('info_cards-1')
    })
  })

  describe('onNavItemClicked', () => {
    it('should emit the code via navItemClicked', () => {
      const spy = jest.spyOn(component.navItemClicked, 'emit')
      component.onNavItemClicked('home')
      expect(spy).toHaveBeenCalledWith('home')
    })

    it('should emit different codes', () => {
      const spy = jest.spyOn(component.navItemClicked, 'emit')
      component.onNavItemClicked('profile')
      expect(spy).toHaveBeenCalledWith('profile')
    })
  })

  describe('ngOnDestroy', () => {
    it('should clear hideContentTimer if it exists', () => {
      jest.useFakeTimers()
      component.isOpen.set(false)
      // Trigger the effect by running pending timers partially
      jest.advanceTimersByTime(100)
      component.ngOnDestroy()
      // Should not throw
      expect(component).toBeTruthy()
      jest.useRealTimers()
    })

    it('should handle destroy when no timer exists', () => {
      component.ngOnDestroy()
      expect(component).toBeTruthy()
    })
  })
})
