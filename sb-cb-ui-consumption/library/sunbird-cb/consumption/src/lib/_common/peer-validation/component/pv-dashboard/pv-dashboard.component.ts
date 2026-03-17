import { Component, OnInit, ViewChild, Inject } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { Router, ActivatedRoute } from '@angular/router'
import { debounceTime } from 'rxjs/operators'
import { ConfirmationDialogComponent } from '../../../dialog-components/confirmation-dialog/confirmation-dialog.component'
import { PeerValidationService } from '../../service/peer-validation.service'
import { ILoaderService, LOADER_SERVICE } from '../../service/loader-service.token'
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

interface Survey {
  id: string
  formId: string
  courseName: string
  thumbnail: string
  organisation?: string
  status: 'Draft' | 'Active' | 'Ended' | 'Archived'
  startDate: string
  endDate: string
  archiveDate: string
  submissionRate: string
  submissionCount: number
  totalCount: number
}

@Component({
  selector: 'sb-uic-pv-dashboard',
  templateUrl: './pv-dashboard.component.html',
  styleUrls: ['./pv-dashboard.component.scss'],
  standalone: false
})
export class PvDashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator

  filterForm!: FormGroup
  displayedColumns: string[] = ['courseName', 'status', 'startDate', 'endDate', 'submissionRate', 'actions']
  dataSource = new MatTableDataSource<Survey>([])
  allSurveys: Survey[] = []
  selectedTabIndex = 0
  selectedTab: 'all' | 'active' | 'ended' | 'draft' | 'archived' = 'all'
  totalCount = 0
  allCount = 0
  activeCount = 0
  endedCount = 0
  draftCount = 0
  archivedCount = 0
  isSPVRoute = false
  isLoading = false

  statusOptions = ['All Status', 'Active', 'Draft', 'Ended', 'Archived']
  mdoOptions = ['All MDO', 'Governor Secretariat, Uttar Pradesh', 'PM Commissionerate of Health and Family Welfare Telangana', 'Karmayogi Bharat (SPV)']

  hasActiveFilters = false

  private computeHasActiveFilters(): boolean {
    if (!this.filterForm) return false
    const v = this.filterForm.value
    return !!v.searchText ||
      !!v.startDate ||
      !!v.endDate ||
      (v.status && v.status !== 'All Status') ||
      (v.mdo && v.mdo !== 'All MDO')
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private peerValidationService: PeerValidationService,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
    @Inject(LOADER_SERVICE) private loaderService: ILoaderService
  ) { }

  ngOnInit(): void {
    // Check if URL contains spv/peer-validation
    this.isSPVRoute = this.router.url.includes('spv/peer-validation')

    // Update displayed columns if SPV route
    if (this.isSPVRoute) {
      this.displayedColumns = ['courseName', 'organisation', 'startDate', 'endDate', 'submissionRate', 'actions']
    }

    this.initializeForm()

    // Check for query parameter to select tab, then load
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        const tabMap: { [key: string]: number } = { 'all': 0, 'active': 1, 'ended': 2, 'draft': 3, 'archived': 4 }
        this.selectedTab = params['tab'] as 'all' | 'active' | 'ended' | 'draft' | 'archived' || 'all'
        this.selectedTabIndex = tabMap[params['tab']] || 0
      }
      this.updateDisplayedColumns()
      this.loadSurveys()
    })
  }

  initializeForm(): void {
    const formConfig: any = {
      searchText: [''],
      startDate: [''],
      endDate: [''],
      status: ['All Status']
    }

    if (this.isSPVRoute) {
      formConfig.mdo = ['All MDO']
    }

    this.filterForm = this.fb.group(formConfig)

    // Re-load surveys when any filter value changes
    // debounceTime prevents rapid successive calls; skip during tab transitions
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
      const hasStart = !!values.startDate
      const hasEnd = !!values.endDate
      if (hasStart !== hasEnd) {
        return // wait until both dates are selected or both are cleared
      }
      this.hasActiveFilters = this.computeHasActiveFilters()
      if (this.paginator) {
        this.paginator.pageIndex = 0
      }
      this.loadSurveys()
    })
  }

  clearAllFilters(): void {
    this.filterForm.patchValue({
      searchText: '',
      startDate: '',
      endDate: '',
      status: 'All Status',
      ...(this.isSPVRoute ? { mdo: 'All MDO' } : {})
    })
    this.hasActiveFilters = false
  }

  buildSearchPayload(): any {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'ended': 'Ended',
      'draft': 'Draft',
      'archived': 'Archived'
    }

    const userProfile: any = this.configSvc?.userProfile || ''

    const pageSize = this.paginator?.pageSize || 15
    const pageIndex = this.paginator?.pageIndex || 0

    const payload: any = {
      query: this.filterForm.value.searchText || '',
      filters: {},
      facets: ['status'],
      page: pageIndex,
      size: pageSize,
      sortBy: 'createdDate',
      sortOrder: 'DESC'
    }

    // Add status filter based on tab
    if (this.selectedTab === 'all') {
      // On 'all' tab, apply the status dropdown filter if a specific status is selected,
      // otherwise send all three statuses
      const selectedStatus = this.filterForm?.value?.status
      if (selectedStatus && selectedStatus !== 'All Status') {
        payload.filters['status'] = [selectedStatus]
      } else {
        payload.filters['status'] = ['Ended', 'Draft', 'Active', 'Archived']
      }
    } else if (statusMap[this.selectedTab]) {
      payload.filters['status'] = [statusMap[this.selectedTab]]
    }

    // Add date range filters (epoch format in milliseconds)
    const startDate = this.filterForm?.value?.startDate
    const endDate = this.filterForm?.value?.endDate
    if (startDate) {
      payload.filters['startDateFrom'] = new Date(startDate).getTime()
    }
    if (endDate) {
      payload.filters['endDateTo'] = new Date(endDate).getTime()
    }

    // Add orgIds filter for SPV route
    if (this.isSPVRoute) {
      payload.filters['orgIds'] = [
        userProfile?.rootOrgId || '',
      ]
    }

    return payload
  }

  loadSurveys(): void {
    this.isLoading = true
    const payload = this.buildSearchPayload()
    if (this.loaderService) {
      this.loaderService.changeLoaderState(true)
    }
    this.peerValidationService.searchPeerValidations(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false
        if (this.loaderService) {
          this.loaderService.changeLoaderState(false)
        }
        const records = response?.result?.response || response?.result?.data || response?.result || []
        const list: any[] = Array.isArray(records) ? records : records?.content || []

        this.allSurveys = list.map((item: any) => this.mapToSurvey(item))
        this.dataSource = new MatTableDataSource(this.allSurveys)
        this.totalCount = response?.result?.response?.count || response?.result?.count || this.allSurveys.length
        // Load status counts for the facet display not to be removed as it is required to show the count in the tabs.
        this.loadStatusCounts()
      },
      error: (error: any) => {
        this.isLoading = false
        if (this.loaderService) {
          this.loaderService.changeLoaderState(false)
        }
        console.error('Error loading surveys:', error)
        this.allSurveys = []
        this.dataSource = new MatTableDataSource([])
      }
    })
  }

  loadStatusCounts(): void {
    const payload: any = {
      query: this.filterForm.value.searchText || '',
      filters: { status: ['Ended', 'Draft', 'Active', 'Archived'] },
      facets: ['status'],
      page: 0,
      size: 0,
      sortBy: 'createdDate',
      sortOrder: 'DESC'
    }

    if (this.loaderService) {
      this.loaderService.changeLoaderState(true)
    }

    this.peerValidationService.searchPeerValidations(payload).subscribe({
      next: (response: any) => {
        if (this.loaderService) {
          this.loaderService.changeLoaderState(false)
        }
        const statusFacets = response?.result?.response?.facets?.status || {}
        this.activeCount = statusFacets['Active'] || 0
        this.endedCount = statusFacets['Ended'] || 0
        this.draftCount = statusFacets['Draft'] || 0
        this.archivedCount = statusFacets['Archived'] || 0
        this.allCount = Object.values(statusFacets as Record<string, number>).reduce((sum: number, val: number) => sum + val, 0) || response?.result?.response?.count || 0
      },
      error: () => {
        if (this.loaderService) {
          this.loaderService.changeLoaderState(false)
        }
      }
    })
  }

  mapToSurvey(item: any): Survey {
    return {
      id: item.id || item.formId || '',
      formId: item.formId || '',
      courseName: item.title || '',
      thumbnail: item.additionalProperties?.thumbnail || '',
      organisation: item.organisation || item.createdByName || '',
      status: item.status || 'Draft',
      startDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      endDate: item.endDate ? new Date(item.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      archiveDate: item.archivedDate ? new Date(item.archivedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      submissionRate: item.submissionRate || '0%',
      submissionCount: item.submissionCount || 0,
      totalCount: item.totalCount || 0
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.loadSurveys()
      })
    }
  }

  filterByTab(): void {
    this.loadSurveys()
  }

  updateDisplayedColumns(): void {
    if (this.selectedTab === 'archived') {
      this.displayedColumns = ['courseName', 'startDate', 'endDate', 'archiveDate', 'submissionRate']
    } else if (this.isSPVRoute) {
      this.displayedColumns = ['courseName', 'organisation', 'startDate', 'endDate', 'submissionRate', 'actions']
    } else {
      this.displayedColumns = ['courseName', 'status', 'startDate', 'endDate', 'submissionRate', 'actions']
    }
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index

    const tabNames: Array<'all' | 'active' | 'ended' | 'draft' | 'archived'> = ['all', 'active', 'ended', 'draft', 'archived']
    this.selectedTab = tabNames[index] || 'all'

    this.updateDisplayedColumns()

    if (this.paginator) {
      this.paginator.pageIndex = 0
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.selectedTab },
      queryParamsHandling: 'merge'
    })

    // this.loadSurveys()
  }

  onSearch(): void {
    this.loadSurveys()
  }

  createNewSurvey(): void {
    const route = this.isSPVRoute ? '/app/home/spv/peer-validation/new' : '/app/home/peer-validation/new'
    this.router.navigate([route])
  }

  editSurvey(survey: Survey): void {
    const basePath = this.isSPVRoute ? '/app/home/spv/peer-validation/edit' : '/app/home/peer-validation/edit'
    this.router.navigate([basePath, survey.formId || survey.id])
  }

  endSurvey(survey: Survey): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'End Survey',
        description: `Are you sure you want to end the survey "${survey.courseName}"? This action cannot be undone.`,
        iconName: 'error_outline',
        type: 'warning',
        buttonsPositionClass: 'justify-center',
        buttons: [
          { text: 'Cancel', classes: 'btn-out-line', response: false },
          { text: 'End Survey', classes: 'succes-button', response: true }
        ]
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        if (this.loaderService) {
          this.loaderService.changeLoaderState(true)
        }
        this.peerValidationService.endForm(survey.formId || survey.id).subscribe({
          next: () => {
            setTimeout(() => {
              this.loadSurveys()
            }, 2000)
          },
          error: (err: any) => {
            if (this.loaderService) {
              this.loaderService.changeLoaderState(false)
            }
            console.error('Error ending survey:', err)
          }
        })
      }
    })
  }

  archiveSurvey(survey: Survey): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Archive Survey',
        description: `Are you sure you want to archive the survey "${survey.courseName}"? This action cannot be undone.`,
        iconName: 'archive',
        type: 'warning',
        buttonsPositionClass: 'justify-center',
        buttons: [
          { text: 'Cancel', classes: 'btn-out-line', response: false },
          { text: 'Archive', classes: 'succes-button', response: true }
        ]
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        if (this.loaderService) {
          this.loaderService.changeLoaderState(true)
        }
        this.peerValidationService.archiveForm(survey.formId || survey.id).subscribe({
          next: () => {
            setTimeout(() => {
              this.loadSurveys()
            }, 2000)
          },
          error: (err: any) => {
            if (this.loaderService) {
              this.loaderService.changeLoaderState(false)
            }
            console.error('Error archiving survey:', err)
          }
        })
      }
    })
  }

  downloadExcel(_survey: Survey): void {
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active'
      case 'Draft':
        return 'status-draft'
      case 'Ended':
        return 'status-ended'
      case 'Archived':
        return 'status-archived'
      default:
        return ''
    }
  }
}
