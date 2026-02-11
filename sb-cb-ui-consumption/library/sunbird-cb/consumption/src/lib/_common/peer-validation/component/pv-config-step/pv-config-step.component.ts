import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { PeerValidationService } from '../../../peer-validation/service/peer-validation.service'

@Component({
  selector: 'sb-uic-pv-config-step',
  templateUrl: './pv-config-step.component.html',
  styleUrls: ['./pv-config-step.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PvConfigStepComponent implements OnInit, OnDestroy {
  configForm!: FormGroup
  courseCharCount = 0
  triggerNumbers = Array.from({ length: 90 }, (_, i) => i + 1)
  courseSearchSubject = new Subject<string>()
  private destroy$ = new Subject<void>()
  courseSearchResults: any[] = []
  isSearching = false
  currentSearchQuery = ''
  currentOffset = 0
  pageSize = 10
  totalResults = 0
  hasMoreResults = false
  selectedCourse: any = null
  currentPage = 1
  cardsPerPage = 5
  environment: any

  constructor(
    private fb: FormBuilder,
    private peerValidationService: PeerValidationService,
    private snackBar: MatSnackBar,
    @Inject('environment') env: any
  ) {
    this.environment = env
  }

  ngOnInit(): void {
    this.initializeForm()
    this.setupCourseSearch()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      course: ['', [Validators.maxLength(70)]],
      selectedCourseDetails: [null, Validators.required],
      triggerValue: [30, Validators.required],
      triggerUnit: ['Days', Validators.required],
      endDate: ['', Validators.required],
      sendToCompletedLearners: [false]
    })
  }

  setupCourseSearch(): void {
    this.courseSearchSubject
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchText: string) => {
        this.searchCourses(searchText)
      })
  }

  onCourseSearch(event: any): void {
    const value = event.target.value || ''
    this.courseCharCount = value.length
    // Reset pagination when search query changes
    this.currentOffset = 0
    this.courseSearchResults = []
    this.courseSearchSubject.next(value)
  }

  searchCourses(query: string, offset: number = 0, append: boolean = false): void {
    this.currentSearchQuery = query

    const payload = {
      request: {
        secureSettings: false,
        filters: {
          accessSettingsEnabled: { "ne": true },
          must: {
            courseCategory: [
              'Course',
              'Case study',
              'Multilingual Course',
              'Curated program',
              'Blended program',
              'invite-only program'
            ]
          },
          status: ['Live']
        },
        offset: offset,
        limit: this.pageSize,
        query: query,
        sort_by: {
          lastUpdatedOn: 'desc'
        },
        fields: []
      }
    }

    this.isSearching = true
    this.peerValidationService.searchContent(payload).subscribe({
      next: (response: any) => {
        this.isSearching = false
        if (response?.result?.content) {
          const results = response.result.content
          this.totalResults = response.result.count || 0

          // Log individual course data to check field names
          if (results.length > 0) {
            console.log('First course data:', results[0])
            console.log('Course fields:', Object.keys(results[0]))
          }

          if (append) {
            // Append results for pagination
            this.courseSearchResults = [...this.courseSearchResults, ...results]
          } else {
            // Replace results for new search
            this.courseSearchResults = results
          }

          this.currentOffset = offset
          this.hasMoreResults = (offset + results.length) < this.totalResults

          // Reset to first page when new search
          if (!append) {
            this.currentPage = 1
          }

          console.log('Search results:', this.courseSearchResults)
          console.log('Total results:', this.totalResults)
          console.log('Paginated courses:', this.paginatedCourses)
          console.log('Current page:', this.currentPage)
          console.log('Total pages:', this.totalPages)
        }
      },
      error: (error) => {
        this.isSearching = false
        console.error('Error searching courses:', error)
        if (!append) {
          this.courseSearchResults = []
        }
      }
    })
  }

  loadMoreResults(): void {
    if (this.hasMoreResults && !this.isSearching) {
      const nextOffset = this.currentOffset + this.pageSize
      this.searchCourses(this.currentSearchQuery, nextOffset, true)
    }
  }

  get paginatedCourses(): any[] {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage
    const endIndex = startIndex + this.cardsPerPage
    return this.courseSearchResults.slice(startIndex, endIndex)
  }

  get totalPages(): number {
    return Math.ceil(this.courseSearchResults.length / this.cardsPerPage)
  }

  get visiblePages(): number[] {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, this.currentPage - 2)
    const end = Math.min(this.totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  shouldShowEllipsis(): boolean {
    return this.totalPages > 5 && this.currentPage < this.totalPages - 2
  }

  shouldShowLastPageButton(): boolean {
    return this.totalPages > 5 && !this.visiblePages.includes(this.totalPages)
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  goToFirstPage(): void {
    this.goToPage(1)
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages)
  }

  selectCourse(course: any): void {
    this.selectedCourse = course
    this.configForm.patchValue({
      selectedCourseDetails: course
    })
  }

  removeSelectedCourse(): void {
    this.selectedCourse = null
    this.configForm.patchValue({
      selectedCourseDetails: null
    })
  }

  isCourseSelected(course: any): boolean {
    return this.selectedCourse?.identifier === course.identifier
  }

  getCorrectUrl(url: string): string {
    if (!url) {
      return '/assets/images/default.png'
    }

    // If URL already has http/https, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // If it's a relative path, prepend environment URL
    if (this.environment.karmYogi) {
      return this.environment.karmYogi + url
    }

    return url
  }

  isFormValid(): boolean {
    if (!this.configForm.get('selectedCourseDetails')?.value) {
      this.snackBar.open('Please search and select a course', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      })
      return false
    }
    return this.configForm.valid
  }

  getFormData() {
    return {
      ...this.configForm.value,
      selectedCourse: this.selectedCourse
    }
  }
}
