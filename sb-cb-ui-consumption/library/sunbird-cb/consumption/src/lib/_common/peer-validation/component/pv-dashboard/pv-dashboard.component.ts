import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { Router, ActivatedRoute } from '@angular/router'
import { ConfirmationDialogComponent } from '../../../dialog-components/confirmation-dialog/confirmation-dialog.component'
import { PeerValidationService } from '../../service/peer-validation.service'

interface Survey {
  id: string
  formId: string
  courseName: string
  thumbnail: string
  organisation?: string
  status: 'Draft' | 'Active' | 'End'
  startDate: string
  endDate: string
  submissionRate: string
  submissionCount: number
  totalCount: number
}

@Component({
  selector: 'sb-uic-pv-dashboard',
  templateUrl: './pv-dashboard.component.html',
  styleUrls: ['./pv-dashboard.component.scss']
})
export class PvDashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator

  filterForm!: FormGroup
  displayedColumns: string[] = ['courseName', 'status', 'startDate', 'endDate', 'submissionRate', 'actions']
  dataSource = new MatTableDataSource<Survey>([])
  allSurveys: Survey[] = []
  selectedTabIndex = 0
  selectedTab: 'all' | 'active' | 'ended' | 'draft' = 'all'
  totalCount = 0
  allCount = 0
  activeCount = 0
  endedCount = 0
  draftCount = 0
  isSPVRoute = false
  isLoading = false

  statusOptions = ['All Status', 'Active', 'Draft', 'Ended']
  mdoOptions = ['All MDO', 'Governor Secretariat, Uttar Pradesh', 'PM Commissionerate of Health and Family Welfare Telangana', 'Karmayogi Bharat (SPV)']

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private peerValidationService: PeerValidationService,
    private dialog: MatDialog
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
        const tabMap: { [key: string]: number } = { 'all': 0, 'active': 1, 'ended': 2, 'draft': 3 }
        this.selectedTab = params['tab'] as 'all' | 'active' | 'ended' | 'draft' || 'all'
        this.selectedTabIndex = tabMap[params['tab']] || 0
      }
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
  }

  buildSearchPayload(): any {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'ended': 'End',
      'draft': 'Draft'
    }

    const payload: any = {
      query: this.filterForm.value.searchText || '',
      filters: {},
      page: 0,
      size: 20,
      sortBy: 'createdDate',
      sortOrder: 'DESC'
    }

    // Add status filter when on a specific tab (not 'all')
    if (this.selectedTab !== 'all' && statusMap[this.selectedTab]) {
      payload.filters['status'] = statusMap[this.selectedTab]
    }

    return payload
  }

  loadSurveys(): void {
    this.isLoading = true
    const payload = this.buildSearchPayload()

    this.peerValidationService.searchPeerValidations(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false
        const records = response?.result?.response || response?.result?.data || response?.result || []
        const list: any[] = Array.isArray(records) ? records : records?.content || []

        this.allSurveys = list.map((item: any) => this.mapToSurvey(item))
        this.dataSource = new MatTableDataSource(this.allSurveys)
        this.dataSource.paginator = this.paginator
        this.totalCount = this.allSurveys.length

        // Update tab counts
        this.allCount = response?.result?.totalCount || this.allSurveys.length
        this.activeCount = this.allSurveys.filter(s => s.status === 'Active').length
        this.endedCount = this.allSurveys.filter(s => s.status === 'End').length
        this.draftCount = this.allSurveys.filter(s => s.status === 'Draft').length
      },
      error: (error: any) => {
        this.isLoading = false
        console.error('Error loading surveys:', error)
        this.allSurveys = []
        this.dataSource = new MatTableDataSource([])
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
      submissionRate: item.submissionRate || '0%',
      submissionCount: item.submissionCount || 0,
      totalCount: item.totalCount || 0
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  filterByTab(): void {
    this.loadSurveys()
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index

    const tabNames: Array<'all' | 'active' | 'ended' | 'draft'> = ['all', 'active', 'ended', 'draft']
    this.selectedTab = tabNames[index] || 'all'

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.selectedTab },
      queryParamsHandling: 'merge'
    })
  }

  onSearch(): void {
    this.loadSurveys()
  }

  createNewSurvey(): void {
    this.router.navigate(['/app/home/peer-validation/new'])
  }

  editSurvey(survey: Survey): void {
    this.router.navigate(['/app/home/peer-validation/edit', survey.formId || survey.id])
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
        this.peerValidationService.archiveForm(survey.formId || survey.id, { status: 'End' }).subscribe({
          next: () => {
            this.loadSurveys()
          },
          error: (err: any) => {
            console.error('Error ending survey:', err)
          }
        })
      }
    })
  }

  deleteSurvey(survey: Survey): void {
    console.log('Delete survey:', survey.id)
  }

  downloadExcel(survey: Survey): void {
    console.log('Download Excel for survey:', survey.id)
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active'
      case 'Draft':
        return 'status-draft'
      case 'End':
        return 'status-end'
      default:
        return ''
    }
  }
}
