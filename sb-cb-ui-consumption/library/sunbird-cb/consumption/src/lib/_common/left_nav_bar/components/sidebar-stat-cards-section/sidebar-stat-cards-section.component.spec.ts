import { SidebarStatCardsSectionComponent } from './sidebar-stat-cards-section.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject } from 'rxjs'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any
const mockCdr = { markForCheck: jest.fn() } as any

describe('SidebarStatCardsSectionComponent', () => {
  let component: SidebarStatCardsSectionComponent

  const mockSection: any = {
    cardType: SidebarCardType.STAT_CARDS,
    sectionTitle: 'My Stats',
    collapsible: true,
    showViewAll: true,
    items: [
      { headerLabel: 'Rank', value: '#5', iconName: 'emoji_events' },
      { headerLabel: 'Points', value: '1200', iconName: 'stars' },
      { headerLabel: 'Badges', value: '8', iconUrl: 'badge-icon' },
      { headerLabel: 'Courses', value: '12', iconName: 'school' }
    ]
  }

  beforeEach(() => {
    component = new SidebarStatCardsSectionComponent(mockTranslateService, mockLangtranslations, mockCdr)
    component.section = mockSection
    component.detailsChanged = false
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
  })

  describe('visibleItems', () => {
    it('should return all items from the section', () => {
      expect(component.visibleItems()).toEqual(mockSection.items)
    })

    it('should return empty array when section items is missing', () => {
      component.section = { ...mockSection, items: undefined }
      component.ngOnChanges({
        section: { previousValue: mockSection, currentValue: component.section, firstChange: false, isFirstChange: () => false }
      } as any)
      expect(component.visibleItems()).toEqual([])
    })
  })

  describe('shouldShowViewAll', () => {
    it('should reflect the section showViewAll flag', () => {
      expect(component.shouldShowViewAll()).toBe(true)
    })

    it('should return false when showViewAll is false', () => {
      component.section = { ...mockSection, showViewAll: false }
      component.ngOnChanges({
        section: { previousValue: mockSection, currentValue: component.section, firstChange: false, isFirstChange: () => false }
      } as any)
      expect(component.shouldShowViewAll()).toBe(false)
    })
  })

  describe('onViewAllClick', () => {
    it('should emit itemClicked with the section viewAllKey', () => {
      const emitSpy = jest.spyOn(component.itemClicked, 'emit')
      component.section = { ...mockSection, viewAllKey: 'stats' }
      component.onViewAllClick()
      expect(emitSpy).toHaveBeenCalledWith({ code: 'stats', subType: '' })
    })

    it('should emit an empty code when viewAllKey is absent', () => {
      const emitSpy = jest.spyOn(component.itemClicked, 'emit')
      component.onViewAllClick()
      expect(emitSpy).toHaveBeenCalledWith({ code: '', subType: '' })
    })
  })

  describe('translateLabels', () => {
    it('should delegate to MultilingualTranslationsService', () => {
      const result = component.translateLabels('Rank', 'header')
      expect(mockLangtranslations.translateActualLabel).toHaveBeenCalledWith('Rank', 'header', '')
      expect(result).toBe('Rank')
    })
  })

  describe('trackByIndex', () => {
    it('should return the index', () => {
      const item: any = { headerLabel: 'Test', value: '1' }
      expect(component.trackByIndex(0, item)).toBe(0)
    })

    it('should return different indices', () => {
      const item: any = { headerLabel: 'Test', value: '2' }
      expect(component.trackByIndex(5, item)).toBe(5)
    })
  })
})
