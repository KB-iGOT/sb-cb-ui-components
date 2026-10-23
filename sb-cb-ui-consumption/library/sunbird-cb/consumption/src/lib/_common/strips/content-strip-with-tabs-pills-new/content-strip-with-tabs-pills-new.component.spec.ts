import { ContentStripWithTabsPillsNewComponent } from './content-strip-with-tabs-pills-new.component'

describe('ContentStripWithTabsPillsNewComponent', () => {
  let component: ContentStripWithTabsPillsNewComponent

  beforeEach(() => {
    component = new ContentStripWithTabsPillsNewComponent(
      { navigate: jest.fn() } as any,
      { markForCheck: jest.fn(), detectChanges: jest.fn() } as any,
      {} as any,
      {} as any,
      { translateActualLabel: jest.fn((label: string) => label) } as any,
      { run: (fn: () => void) => fn() } as any,
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
