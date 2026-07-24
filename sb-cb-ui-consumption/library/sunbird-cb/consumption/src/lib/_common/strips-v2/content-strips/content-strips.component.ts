import { Component, input, inject, signal, ChangeDetectionStrategy, DestroyRef, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentConfig, CardType } from '../models/content-section.model'
import { CardViewModel } from '../models/card.model'
import { ContentApiService } from '../services/content-api.service'
import { CardTransformerService } from '../services/card-transformer.service'
import { CarouselComponent } from '../../carousel/carousel.component'
import { CardCourseV2Component } from '../../../../public-api'
import { Router } from '@angular/router'

@Component({
  selector: 'sb-uic-content-strips',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    CardCourseV2Component],
  templateUrl: './content-strips.component.html',
  styleUrl: './content-strips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentStripsComponent implements OnInit {
  contentConfig = input.required<ContentConfig>();

  // Expose CardType enum so the template can use it in @switch
  CardType = CardType;
  cbPlanMapData: any

  private apiService = inject(ContentApiService);
  private cardTransformer = inject(CardTransformerService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  cards = signal<CardViewModel[]>([]);
  skeletonArray = signal<number[]>([]);
  loading = signal<boolean>(true);

  // Dummy cards for carousel testing
  dummyCards = signal([
    { id: 1, title: 'High-Speed Rail Development: Context and...', image: 'https://picsum.photos/seed/1/400/240', rating: 4.3, provider: 'Indian Cybercrime...', duration: '1h 14m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: true },
    { id: 2, title: 'Stay Safe in Cyber Space', image: 'https://picsum.photos/seed/2/400/240', rating: 4.3, provider: 'Indian Cybercrime...', duration: '1h 14m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: true },
    { id: 3, title: 'Digital Forensics Fundamentals', image: 'https://picsum.photos/seed/3/400/240', rating: 4.1, provider: 'Karmayogi Bharat', duration: '55m 30s', level: 'Intermediate', tags: ['APAR'], badge: '', overdue: false },
    { id: 4, title: 'Cyber Law and Ethics', image: 'https://picsum.photos/seed/4/400/240', rating: 3.9, provider: 'Karmayogi Bharat', duration: '28m 38s', level: 'Beginner', tags: ['CA'], badge: '', overdue: true },
    { id: 5, title: 'CRS ADV - Community Services', image: 'https://picsum.photos/seed/5/400/240', rating: 5, provider: 'Karmayogi Bharat', duration: '45m', level: 'Advanced', tags: ['APAR'], badge: '', overdue: true },
    { id: 6, title: 'Healthcare Representative - C467950', image: 'https://picsum.photos/seed/6/400/240', rating: 4.5, provider: 'Karmayogi Bharat', duration: '55m 54s', level: 'Beginner', tags: ['APAR'], badge: '', overdue: true },
    { id: 7, title: 'Technology Technician - C822364', image: 'https://picsum.photos/seed/7/400/240', rating: 4.0, provider: 'Karmayogi Bharat', duration: '1h 14m', level: 'Intermediate', tags: ['CA'], badge: '', overdue: false },
    { id: 8, title: 'Data Privacy and Security', image: 'https://picsum.photos/seed/8/400/240', rating: 4.2, provider: 'Indian Cybercrime...', duration: '38m', level: 'Beginner', tags: ['APAR', 'CA'], badge: 'Most popular', overdue: false },
    { id: 9, title: 'Cloud Computing Basics', image: 'https://picsum.photos/seed/9/400/240', rating: 4.4, provider: 'Karmayogi Bharat', duration: '1h 02m', level: 'Beginner', tags: ['CA'], badge: '', overdue: false },
    { id: 10, title: 'AI and Machine Learning Overview', image: 'https://picsum.photos/seed/10/400/240', rating: 4.7, provider: 'Karmayogi Bharat', duration: '1h 30m', level: 'Intermediate', tags: ['APAR'], badge: 'Most popular', overdue: false },
    { id: 11, title: 'Project Management Essentials', image: 'https://picsum.photos/seed/11/400/240', rating: 3.8, provider: 'Karmayogi Bharat', duration: '42m', level: 'Beginner', tags: ['CA'], badge: '', overdue: true },
    { id: 12, title: 'Leadership and Governance', image: 'https://picsum.photos/seed/12/400/240', rating: 4.6, provider: 'Karmayogi Bharat', duration: '58m', level: 'Advanced', tags: ['APAR', 'CA'], badge: '', overdue: false },
  ]);

  ngOnInit(): void {
    this.initializeSkeletons()
    this.fetchContent()
    this.getCbPlanData()
  }

  initializeSkeletons(): void {
    const max = this.contentConfig()?.maxCardsToShow ?? 4
    this.skeletonArray.set(new Array(max).fill(0).map((_, i) => i))
  }

  async fetchContent(): Promise<void> {
    const config = this.contentConfig()
    if (!config?.apiDetailsKey) {
      this.loading.set(false)
      return
    }

    this.loading.set(true)
      ; (await this.apiService.loadContent(config.apiDetailsKey))
        .subscribe({
          next: (response) => {
            const transformed = this.cardTransformer.transformCards(response, config.cardType, config.apiDetailsKey)
            const limited = transformed.slice(0, config.maxCardsToShow ?? 4)
            this.cards.set(limited)
            this.loading.set(false)
          },
          error: () => {
            this.cards.set([])
            this.loading.set(false)
          }
        })
  }

  getCbPlanData() {
    let cbpList: any = {}
    if (localStorage.getItem('cbpData')) {
      let cbpListArr = JSON.parse(localStorage.getItem('cbpData') || '')
      if (cbpListArr && cbpListArr.length) {
        cbpListArr.forEach((data: any) => {
          cbpList[data.identifier] = data
        })
      }
      this.cbPlanMapData = cbpList
    }
  }

  getViewAllUrl(): { path: string, queryParams?: Record<string, any>, f?: any } | null {
    return this.contentConfig()?.viewMoreUrl ?? null
  }

  redirectViewAll(path: string, queryParamsData: any, filters?: any) {
    let queryParams = queryParamsData
    if (filters) {
      queryParams = {
        f: JSON.stringify(filters),
        queryParamsData
      }
    }
    this.navigateToRoute(path, queryParams)
  }

  private navigateToRoute(path: string, queryParamsData: any): void {
    this.router.navigate([path], { queryParams: queryParamsData })
  }

  shouldShowViewAll(): boolean {
    return (this.contentConfig()?.showViewAll && this.cards().length > 4) ?? false
  }

  getCardType(): CardType {
    return this.contentConfig()?.cardType ?? CardType.CourseCard
  }
}
