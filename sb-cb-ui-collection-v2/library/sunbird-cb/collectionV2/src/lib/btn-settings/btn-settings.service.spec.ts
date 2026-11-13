import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { BtnSettingsService } from './btn-settings.service'

describe('BtnSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }))

  it('should be created', () => {
    const service: BtnSettingsService = TestBed.inject(BtnSettingsService)
    expect(service).toBeTruthy()
  })

  describe('theme stylesheet injection', () => {
    const theme: any = {
      themeClass: 'theme-igot',
      themeFile: 'theme-igot',
      themeName: 'iGOT Theme',
      color: { primary: '#ffffff', accent: '#00A9F4', warn: '#f44336' },
    }
    const added: HTMLElement[] = []
    let service: BtnSettingsService

    const addLink = (href: string) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      added.push(link)
    }
    const injectedThemeLinks = () =>
      Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
        .filter(l => l.getAttribute('href') === 'theme-igot.css' && !added.includes(l as HTMLElement))

    beforeEach(() => {
      const meta = document.createElement('meta')
      meta.id = 'id-app-theme-color'
      document.head.appendChild(meta)
      added.push(meta)
      service = TestBed.inject(BtnSettingsService)
      service.useLinkForThemeInjection = true
    })

    afterEach(() => {
      injectedThemeLinks().forEach(l => l.remove())
      added.splice(0).forEach(el => el.remove())
      document.documentElement.classList.remove('theme-igot')
    })

    it('does not inject a link when the build already linked the hashed theme stylesheet', () => {
      addLink('theme-igot-W4TMCGX2.css')
      ;(service as any).applyTheme(theme)
      expect(injectedThemeLinks().length).toBe(0)
      expect(document.documentElement.classList.contains('theme-igot')).toBe(true)
    })

    it('does not inject a link when the build linked the unhashed theme stylesheet', () => {
      addLink('theme-igot.css')
      ;(service as any).applyTheme(theme)
      expect(document.head.querySelectorAll('link[href="theme-igot.css"]').length).toBe(1)
    })

    it('still injects the link when no stylesheet for the theme is present', () => {
      ;(service as any).applyTheme(theme)
      expect(injectedThemeLinks().length).toBe(1)
    })

    it('does not treat a differently named theme stylesheet as this theme', () => {
      addLink('theme-igot-dark.css')
      addLink('theme-igot-darkmode.css')
      ;(service as any).applyTheme(theme)
      expect(injectedThemeLinks().length).toBe(1)
    })
  })
})
