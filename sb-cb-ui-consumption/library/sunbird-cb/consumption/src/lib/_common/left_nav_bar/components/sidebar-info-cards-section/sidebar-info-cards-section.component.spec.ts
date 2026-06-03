import { SidebarInfoCardsSectionComponent } from './sidebar-info-cards-section.component'
import { SidebarCardType } from '../../models/sidebar.models'
import { Subject } from 'rxjs'

const mockTranslateService = { setDefaultLang: jest.fn(), use: jest.fn() } as any
const mockLangtranslations = {
  languageSelectedObservable: new Subject(),
  translateActualLabel: jest.fn((label: string) => label)
} as any

describe('SidebarInfoCardsSectionComponent', () => {
  let component: SidebarInfoCardsSectionComponent

  const mockSection: any = {
    cardType: SidebarCardType.INFO_CARDS,
    sectionTitle: 'Quick Links',
    collapsible: true,
    showViewAll: false,
    items: [
      {
        hasChildren: false,
        title: 'Documentation',
        description: 'View docs',
        navUrl: '/docs',
        iconName: 'description'
      },
      {
        hasChildren: true,
        title: 'Resources',
        description: 'Learning resources',
        navUrl: '/resources',
        iconUrl: 'resources-icon',
        children: [
          { title: 'Videos', description: 'Watch videos', navUrl: '/videos', iconName: 'videocam' },
          { title: 'Articles', description: 'Read articles', navUrl: '/articles', iconUrl: 'article-icon' }
        ]
      },
      {
        hasChildren: true,
        title: 'Empty Group',
        description: 'No children',
        navUrl: '/empty',
        children: []
      }
    ]
  }

  beforeEach(() => {
    component = new SidebarInfoCardsSectionComponent(mockTranslateService, mockLangtranslations)
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

    it('should have expandedCards signal with empty Set', () => {
      expect(component.expandedCards()).toEqual(new Set())
    })
  })

  describe('toggleCardExpansion', () => {
    it('should add index to expandedCards when not present', () => {
      component.toggleCardExpansion(0)
      expect(component.expandedCards().has(0)).toBe(true)
    })

    it('should remove index from expandedCards when already present', () => {
      component.toggleCardExpansion(0)
      component.toggleCardExpansion(0)
      expect(component.expandedCards().has(0)).toBe(false)
    })

    it('should handle multiple expanded cards', () => {
      component.toggleCardExpansion(0)
      component.toggleCardExpansion(1)
      component.toggleCardExpansion(2)
      expect(component.expandedCards().has(0)).toBe(true)
      expect(component.expandedCards().has(1)).toBe(true)
      expect(component.expandedCards().has(2)).toBe(true)
    })

    it('should only remove the targeted card', () => {
      component.toggleCardExpansion(0)
      component.toggleCardExpansion(1)
      component.toggleCardExpansion(0)
      expect(component.expandedCards().has(0)).toBe(false)
      expect(component.expandedCards().has(1)).toBe(true)
    })
  })

  describe('isCardExpanded', () => {
    it('should return false for unexpanded card', () => {
      expect(component.isCardExpanded(0)).toBe(false)
    })

    it('should return true for expanded card', () => {
      component.toggleCardExpansion(1)
      expect(component.isCardExpanded(1)).toBe(true)
    })

    it('should return false after toggling twice', () => {
      component.toggleCardExpansion(2)
      component.toggleCardExpansion(2)
      expect(component.isCardExpanded(2)).toBe(false)
    })

    it('should correctly identify different card states', () => {
      component.toggleCardExpansion(0)
      component.toggleCardExpansion(2)
      expect(component.isCardExpanded(0)).toBe(true)
      expect(component.isCardExpanded(1)).toBe(false)
      expect(component.isCardExpanded(2)).toBe(true)
    })
  })

  describe('trackByTitle', () => {
    it('should return item title when it exists', () => {
      const item: any = { title: 'Documentation', hasChildren: false, description: '', navUrl: '' }
      const result = component.trackByTitle(0, item)
      expect(result).toBe('Documentation')
    })

    it('should return fallback string when title is empty', () => {
      const item: any = { title: '', hasChildren: false, description: '', navUrl: '' }
      const result = component.trackByTitle(2, item)
      expect(result).toBe('info-item-2')
    })

    it('should return fallback string when title is undefined', () => {
      const item: any = { hasChildren: false, description: '', navUrl: '' }
      const result = component.trackByTitle(1, item)
      expect(result).toBe('info-item-1')
    })

    it('should use correct index in fallback', () => {
      const item: any = { title: '', hasChildren: false, description: '', navUrl: '' }
      const result = component.trackByTitle(5, item)
      expect(result).toBe('info-item-5')
    })
  })

  describe('trackByChildTitle', () => {
    it('should return child title when it exists', () => {
      const child: any = { title: 'Videos', description: '', navUrl: '' }
      const result = component.trackByChildTitle(0, child)
      expect(result).toBe('Videos')
    })

    it('should return fallback string when title is empty', () => {
      const child: any = { title: '', description: '', navUrl: '' }
      const result = component.trackByChildTitle(1, child)
      expect(result).toBe('child-item-1')
    })

    it('should return fallback string when title is undefined', () => {
      const child: any = { description: '', navUrl: '' }
      const result = component.trackByChildTitle(3, child)
      expect(result).toBe('child-item-3')
    })

    it('should use correct index in fallback', () => {
      const child: any = { title: '', description: '', navUrl: '' }
      const result = component.trackByChildTitle(4, child)
      expect(result).toBe('child-item-4')
    })
  })
})
