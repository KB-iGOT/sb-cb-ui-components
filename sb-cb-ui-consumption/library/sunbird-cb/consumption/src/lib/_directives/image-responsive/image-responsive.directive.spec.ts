import { of } from 'rxjs'
import { ImageResponsiveDirective } from './image-responsive.directive'

describe('ImageResponsiveDirective', () => {
  it('should create an instance', () => {
    const mockBreakpointObserver = {
      observe: jest.fn().mockReturnValue(of({ breakpoints: {} })),
    }
    const directive = new ImageResponsiveDirective(mockBreakpointObserver as any)
    expect(directive).toBeTruthy()
  })
})
