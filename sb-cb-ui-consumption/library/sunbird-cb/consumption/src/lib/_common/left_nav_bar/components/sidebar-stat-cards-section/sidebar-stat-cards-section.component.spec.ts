import { SidebarStatCardsSectionComponent } from './sidebar-stat-cards-section.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject } from 'rxjs'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any

describe('SidebarStatCardsSectionComponent', () => {
  let component: SidebarStatCardsSectionComponent

  const mockSection: any = {
    cardType: SidebarCardType.STAT_CARDS,
    sectionTitle: 'My Stats',
    collapsible: true,
    showViewAll: true,
    maxItemsVisible: 2,
    items: [
      { headerLabel: 'Rank', value: '#5', iconName: 'emoji_events' },
      { headerLabel: 'Points', value: '1200', iconName: 'stars' },
      { headerLabel: 'Badges', value: '8', iconUrl: 'badge-icon' },
      { headerLabel: 'Courses', value: '12', iconName: 'school' }
    ]
  }

  beforeEach(() => {
    component = new SidebarStatCardsSectionComponent(mockTranslateService, mockLangtranslations)
    component.section = mockSection
    component.isOpen = true
    component.showContent = true
  })

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should have isExpanded signal default to false', () => {
      expect(component.isExpanded()).toBe(false)
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
    it('should return limited items when showViewAll is true and not expanded', () => {
      const items = component.visibleItems()
      expect(items.length).toBe(2)
    })

    it('should return all items when expanded', () => {
      component.isExpanded.set(true)
      const items = component.visibleItems()
      expect(items.length).toBe(4)
    })

    it('should return all items when showViewAll is false', () => {
      component.section = { ...mockSection, showViewAll: false } as any
      const items = component.visibleItems()
      expect(items.length).toBe(4)
    })

    it('should return empty array when section items is null', () => {
      component.section = { ...mockSection, items: null } as any
      const items = component.visibleItems()
      expect(items).toEqual([])
    })

    it('should return empty array when section items is undefined', () => {
      component.section = { ...mockSection, items: undefined } as any
      const items = component.visibleItems()
      expect(items).toEqual([])
    })

    it('should use DEFAULTS.MAX_ITEMS_VISIBLE when maxItemsVisible is not set', () => {
      component.section = { ...mockSection, maxItemsVisible: undefined } as any
      const items = component.visibleItems()
      // DEFAULTS.MAX_ITEMS_VISIBLE is 3
      expect(items.length).toBe(3)
    })

    it('should use maxItemsVisible from config when set', () => {
      component.section = { ...mockSection, maxItemsVisible: 1 } as any
      const items = component.visibleItems()
      expect(items.length).toBe(1)
    })

    it('should return all items when maxItemsVisible is null', () => {
      component.section = { ...mockSection, maxItemsVisible: null } as any
      const items = component.visibleItems()
      expect(items.length).toBe(4)
    })
  })

  describe('shouldShowViewAll', () => {
    it('should return true when items exceed maxItemsVisible', () => {
      const result = component.shouldShowViewAll()
      expect(result).toBe(true)
    })

    it('should return false when showViewAll is false', () => {
      component.section = { ...mockSection, showViewAll: false } as any
      const result = component.shouldShowViewAll()
      expect(result).toBe(false)
    })

    it('should return false when items is null', () => {
      component.section = { ...mockSection, items: null } as any
      const result = component.shouldShowViewAll()
      expect(result).toBe(false)
    })

    it('should return false when items is undefined', () => {
      component.section = { ...mockSection, items: undefined } as any
      const result = component.shouldShowViewAll()
      expect(result).toBe(false)
    })

    it('should return false when items length is less than maxItemsVisible', () => {
      component.section = {
        ...mockSection,
        maxItemsVisible: 10
      } as any
      const result = component.shouldShowViewAll()
      expect(result).toBe(false)
    })

    it('should return false when items length equals maxItemsVisible', () => {
      component.section = {
        ...mockSection,
        maxItemsVisible: 4
      } as any
      const result = component.shouldShowViewAll()
      expect(result).toBe(false)
    })
  })

  describe('toggleViewAll', () => {
    it('should toggle isExpanded from false to true', () => {
      expect(component.isExpanded()).toBe(false)
      component.toggleViewAll()
      expect(component.isExpanded()).toBe(true)
    })

    it('should toggle isExpanded from true to false', () => {
      component.isExpanded.set(true)
      component.toggleViewAll()
      expect(component.isExpanded()).toBe(false)
    })

    it('should toggle multiple times correctly', () => {
      component.toggleViewAll()
      component.toggleViewAll()
      component.toggleViewAll()
      expect(component.isExpanded()).toBe(true)
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
