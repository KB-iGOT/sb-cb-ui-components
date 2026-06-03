import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component, TemplateRef, ViewChild } from '@angular/core'
import { CarouselComponent } from './carousel.component'
import { By } from '@angular/platform-browser'

// Host component for testing content projection
@Component({
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <sb-uic-carousel [items]="items" [cardWidth]="200" [gap]="16" [showDots]="true" [showNavigation]="true">
      <ng-template #carouselCard let-item let-index="index">
        <div class="test-card">{{ item.title }} - {{ index }}</div>
      </ng-template>
    </sb-uic-carousel>
  `,
})
class TestHostComponent {
  items = Array.from({ length: 12 }, (_, i) => ({ title: `Card ${i + 1}` }));
}

describe('CarouselComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent
  let carouselEl: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CarouselComponent],
    }).compileComponents()

    hostFixture = TestBed.createComponent(TestHostComponent)
    hostComponent = hostFixture.componentInstance
    hostFixture.detectChanges()
    carouselEl = hostFixture.debugElement.query(By.directive(CarouselComponent)).nativeElement
  })

  it('should create the carousel', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent))
    expect(carousel).toBeTruthy()
  })

  it('should render all items', () => {
    const cards = carouselEl.querySelectorAll('.carousel-item')
    expect(cards.length).toBe(12)
  })

  it('should render card content via template', () => {
    const firstCard = carouselEl.querySelector('.test-card')
    expect(firstCard?.textContent).toContain('Card 1')
  })

  it('should disable previous button on first page', () => {
    const prevBtn = carouselEl.querySelector('.carousel-nav-prev') as HTMLButtonElement
    expect(prevBtn.disabled).toBe(true)
  })

  it('should enable next button when there are more pages', () => {
    // Force a container width that shows fewer cards than total
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    // Simulate narrow container: only 2 cards visible
    (carousel as any).containerWidth.set(432) // (200 + 16) * 2 = 432
    hostFixture.detectChanges()

    const nextBtn = carouselEl.querySelector('.carousel-nav-next') as HTMLButtonElement
    expect(nextBtn.disabled).toBe(false)
  })

  it('should navigate to next page on next click', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    carousel.goNext()
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(1)
  })

  it('should navigate to previous page on prev click', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    carousel.goNext()
    carousel.goPrevious()
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(0)
  })

  it('should not go past last page', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432) // 2 visible, 6 pages
    hostFixture.detectChanges()

    const totalPages = carousel.totalPages()
    // Try to go beyond
    carousel.goToPage(totalPages + 5)
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(totalPages - 1)
  })

  it('should navigate to specific page on dot click', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    carousel.goToPage(3)
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(3)
  })

  it('should calculate visible cards based on container width', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;

    // Container fits 4 cards: (200+16)*4 - 16 = 848, so width=864 -> floor((864+16)/(216))=4
    (carousel as any).containerWidth.set(864)
    expect(carousel.visibleCards()).toBe(4);

    // Container fits 2 cards
    (carousel as any).containerWidth.set(432)
    expect(carousel.visibleCards()).toBe(2);

    // Container fits 1 card
    (carousel as any).containerWidth.set(200)
    expect(carousel.visibleCards()).toBe(1)
  })

  it('should calculate total pages correctly', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    // 12 items, 4 visible, scrollBy=4 -> ceil((12-4)/4) + 1 = 3
    (carousel as any).containerWidth.set(864)
    hostFixture.detectChanges()
    expect(carousel.totalPages()).toBe(3)
  })

  it('should render correct number of dots', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    const dots = carouselEl.querySelectorAll('.carousel-dot')
    expect(dots.length).toBe(carousel.totalPages())
  })

  it('should mark active dot correctly', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    carousel.goToPage(2)
    hostFixture.detectChanges()

    const dots = carouselEl.querySelectorAll('.carousel-dot')
    expect(dots[2].classList.contains('active')).toBe(true)
    expect(dots[0].classList.contains('active')).toBe(false)
  })

  it('should emit pageChanged on navigation', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    const spy = jest.fn()
    carousel.pageChanged.subscribe(spy)

    carousel.goNext()
    expect(spy).toHaveBeenCalledWith(1)
  })

  it('should emit itemClicked on card click', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent
    const spy = jest.fn()
    carousel.itemClicked.subscribe(spy)

    const firstCard = carouselEl.querySelector('.carousel-item') as HTMLElement
    firstCard.click()
    hostFixture.detectChanges()

    expect(spy).toHaveBeenCalledWith({ item: { title: 'Card 1' }, index: 0 })
  })

  it('should handle keyboard navigation', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    const container = carouselEl.querySelector('.carousel-container') as HTMLElement
    container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(1)

    container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBe(0)
  })

  it('should clamp page when items change and reduce total pages', () => {
    const carousel = hostFixture.debugElement.query(By.directive(CarouselComponent)).componentInstance as CarouselComponent;
    (carousel as any).containerWidth.set(432)
    hostFixture.detectChanges()

    carousel.goToPage(5)
    hostFixture.detectChanges()

    // Reduce items to 4
    hostComponent.items = Array.from({ length: 4 }, (_, i) => ({ title: `Card ${i + 1}` }))
    hostFixture.detectChanges()

    expect(carousel.currentPage()).toBeLessThanOrEqual(carousel.totalPages() - 1)
  })

  it('should have proper ARIA attributes', () => {
    const container = carouselEl.querySelector('[role="region"]')
    expect(container?.getAttribute('aria-roledescription')).toBe('carousel')
    expect(container?.getAttribute('aria-label')).toBe('Content carousel')

    const slides = carouselEl.querySelectorAll('[role="group"]')
    expect(slides.length).toBe(12)
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide')
  })
})
