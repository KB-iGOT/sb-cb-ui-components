// karma-redeem-dialog.component.spec.ts
// Pure unit tests - component instantiated directly, no TestBed.

import { KarmaRedeemDialogComponent } from './karma-redeem-dialog.component'

describe('KarmaRedeemDialogComponent', () => {
  let component: KarmaRedeemDialogComponent

  beforeEach(() => {
    component = new KarmaRedeemDialogComponent()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should default data to an empty object', () => {
    expect(component.data).toEqual({})
  })

  it('should expose a closed output emitter', () => {
    expect(component.closed).toBeDefined()
    expect(typeof component.closed.emit).toBe('function')
  })

  describe('icon', () => {
    it('should return the icon from data when provided', () => {
      component.data = { icon: '/assets/icons/custom-icon.svg' }
      expect(component.icon).toBe('/assets/icons/custom-icon.svg')
    })

    it('should return the default icon when data has no icon', () => {
      component.data = {}
      expect(component.icon).toBe('/assets/icons/home-v2/karma-badge.svg')
    })

    it('should return the default icon when icon is an empty string', () => {
      component.data = { icon: '' }
      expect(component.icon).toBe('/assets/icons/home-v2/karma-badge.svg')
    })

    it('should return the default icon when data is null', () => {
      component.data = null
      expect(component.icon).toBe('/assets/icons/home-v2/karma-badge.svg')
    })

    it('should return the default icon when data is undefined', () => {
      component.data = undefined
      expect(component.icon).toBe('/assets/icons/home-v2/karma-badge.svg')
    })
  })

  describe('header', () => {
    it('should return the header from data when provided', () => {
      component.data = { header: 'Custom header' }
      expect(component.header).toBe('Custom header')
    })

    it('should return the default header when data has no header', () => {
      component.data = {}
      expect(component.header).toBe(`You're all set! 🎉`)
    })

    it('should return the default header when header is an empty string', () => {
      component.data = { header: '' }
      expect(component.header).toBe(`You're all set! 🎉`)
    })

    it('should return the default header when data is null', () => {
      component.data = null
      expect(component.header).toBe(`You're all set! 🎉`)
    })
  })

  describe('message', () => {
    it('should return the message from data when provided', () => {
      component.data = { message: 'Custom message', requiredKarmaPoints: 50 }
      expect(component.message).toBe('Custom message')
    })

    it('should build the message from requiredKarmaPoints when message is absent', () => {
      component.data = { requiredKarmaPoints: 120 }
      expect(component.message).toBe('Redeem 120 Karma Coins to unlock this course and start learning.')
    })

    it('should treat zero required karma points as a valid value', () => {
      component.data = { requiredKarmaPoints: 0 }
      expect(component.message).toBe('Redeem 0 Karma Coins to unlock this course and start learning.')
    })

    it('should fall back to zero karma coins when requiredKarmaPoints is missing', () => {
      component.data = {}
      expect(component.message).toBe('Redeem 0 Karma Coins to unlock this course and start learning.')
    })

    it('should fall back to zero karma coins when requiredKarmaPoints is null', () => {
      component.data = { requiredKarmaPoints: null }
      expect(component.message).toBe('Redeem 0 Karma Coins to unlock this course and start learning.')
    })

    it('should fall back to zero karma coins when data is null', () => {
      component.data = null
      expect(component.message).toBe('Redeem 0 Karma Coins to unlock this course and start learning.')
    })

    it('should build the message from requiredKarmaPoints when message is an empty string', () => {
      component.data = { message: '', requiredKarmaPoints: 5 }
      expect(component.message).toBe('Redeem 5 Karma Coins to unlock this course and start learning.')
    })
  })

  describe('acceptButton', () => {
    it('should return the accept label from data when provided', () => {
      component.data = { acceptButton: 'Redeem now' }
      expect(component.acceptButton).toBe('Redeem now')
    })

    it('should return the default accept label when data has no acceptButton', () => {
      component.data = {}
      expect(component.acceptButton).toBe('Continue')
    })

    it('should return the default accept label when acceptButton is an empty string', () => {
      component.data = { acceptButton: '' }
      expect(component.acceptButton).toBe('Continue')
    })

    it('should return the default accept label when data is null', () => {
      component.data = null
      expect(component.acceptButton).toBe('Continue')
    })
  })

  describe('cancelButton', () => {
    it('should return the cancel label from data when provided', () => {
      component.data = { cancelButton: 'Not now' }
      expect(component.cancelButton).toBe('Not now')
    })

    it('should return the default cancel label when data has no cancelButton', () => {
      component.data = {}
      expect(component.cancelButton).toBe('Cancel')
    })

    it('should return the default cancel label when cancelButton is an empty string', () => {
      component.data = { cancelButton: '' }
      expect(component.cancelButton).toBe('Cancel')
    })

    it('should return the default cancel label when data is null', () => {
      component.data = null
      expect(component.cancelButton).toBe('Cancel')
    })
  })

  describe('onContinue', () => {
    it('should emit true on the closed output', () => {
      const emitSpy = jest.spyOn(component.closed, 'emit')
      component.onContinue()
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith(true)
    })

    it('should notify subscribers with true', () => {
      const received: boolean[] = []
      component.closed.subscribe((value: boolean) => received.push(value))
      component.onContinue()
      expect(received).toEqual([true])
    })
  })

  describe('onCancel', () => {
    it('should emit false on the closed output', () => {
      const emitSpy = jest.spyOn(component.closed, 'emit')
      component.onCancel()
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith(false)
    })

    it('should notify subscribers with false', () => {
      const received: boolean[] = []
      component.closed.subscribe((value: boolean) => received.push(value))
      component.onCancel()
      expect(received).toEqual([false])
    })
  })

  describe('onEscape', () => {
    it('should cancel the dialog', () => {
      const cancelSpy = jest.spyOn(component, 'onCancel')
      component.onEscape()
      expect(cancelSpy).toHaveBeenCalledTimes(1)
    })

    it('should emit false on the closed output', () => {
      const emitSpy = jest.spyOn(component.closed, 'emit')
      component.onEscape()
      expect(emitSpy).toHaveBeenCalledWith(false)
    })
  })
})
