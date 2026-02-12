import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { Router, ActivatedRoute } from '@angular/router'

interface Survey {
  id: string
  courseName: string
  organisation?: string
  status: 'DRAFT' | 'ACTIVE' | 'END'
  startDate: string
  endDate: string
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
  selectedTab: 'all' | 'active' | 'ended' | 'draft' = 'all'
  totalCount = 42
  allCount = 100
  activeCount = 25
  endedCount = 50
  draftCount = 25
  isSPVRoute = false

  statusOptions = ['All Status', 'Active', 'Draft', 'Ended']
  mdoOptions = ['All MDO', 'Governor Secretariat, Uttar Pradesh', 'PM Commissionerate of Health and Family Welfare Telangana', 'Karmayogi Bharat (SPV)']

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if URL contains spv/peer-validation
    this.isSPVRoute = this.router.url.includes('spv/peer-validation')

    // Update displayed columns if SPV route
    if (this.isSPVRoute) {
      this.displayedColumns = ['courseName', 'organisation', 'startDate', 'endDate', 'submissionRate', 'actions']
    }

    this.initializeForm()
    this.loadSurveys()

    // Check for query parameter to select tab
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        const tabMap: { [key: string]: number } = {
          'all': 0,
          'active': 1,
          'ended': 2,
          'draft': 3
        }
        this.selectedTab = params['tab'] as 'all' | 'active' | 'ended' | 'draft' || 'all'
        this.selectedTabIndex = tabMap[params['tab']] || 0
        this.filterByTab()
      }
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

  loadSurveys(): void {
    // Mock data - replace with actual API call
    const mockData: Survey[] = [
      {
        id: '1',
        courseName: 'Peer Feedback - Q4 2024',
        organisation: 'Governor Secretariat, Uttar PradeshState',
        status: 'DRAFT',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '20%',
        submissionCount: 40,
        totalCount: 200
      },
      {
        id: '2',
        courseName: 'Peer Feedback - Q4 2024',
        organisation: 'PM Commissionerate of Health and Family Welfare TelanganaState',
        status: 'ACTIVE',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '50%',
        submissionCount: 30,
        totalCount: 60
      },
      {
        id: '3',
        courseName: 'Peer Feedback - Q4 2024',
        organisation: 'Governor Secretariat, Uttar PradeshState',
        status: 'END',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '30%',
        submissionCount: 60,
        totalCount: 200
      },
      {
        id: '4',
        courseName: 'Peer Feedback - Q4 2024',
        organisation: 'Karmayogi Bharat (SPV)',
        status: 'DRAFT',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '80%',
        submissionCount: 16,
        totalCount: 20
      },
      {
        id: '5',
        courseName: 'Peer Feedback - Q4 2024',
        organisation: 'Governor Secretariat, Uttar PradeshState',
        status: 'ACTIVE',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '60%',
        submissionCount: 6,
        totalCount: 10
      }
    ]

    this.allSurveys = mockData
    this.dataSource = new MatTableDataSource(mockData)
    this.dataSource.paginator = this.paginator
    this.filterByTab()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  filterByTab(): void {
    let filteredData: Survey[]

    switch (this.selectedTabIndex) {
      case 0: // All
        filteredData = this.allSurveys
        break
      case 1: // Active
        filteredData = this.allSurveys.filter(s => s.status === 'ACTIVE')
        break
      case 2: // Ended
        filteredData = this.allSurveys.filter(s => s.status === 'END')
        break
      case 3: // Draft
        filteredData = this.allSurveys.filter(s => s.status === 'DRAFT')
        break
      default:
        filteredData = this.allSurveys
    }

    this.dataSource.data = filteredData
    this.totalCount = filteredData.length
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index

    // Map index to tab name and update query params
    const tabNames: Array<'all' | 'active' | 'ended' | 'draft'> = ['all', 'active', 'ended', 'draft']
    this.selectedTab = tabNames[index] || 'all'

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.selectedTab },
      queryParamsHandling: 'merge'
    })

    // Filter data based on tab
    this.filterByTab()
  }

  onSearch(): void {
    // Implement search logic here
    console.log('Filters:', this.filterForm.value)
  }

  createNewSurvey(): void {
    const route = this.isSPVRoute ? '/app/home/spv/peer-validation/new' : '/app/home/peer-validation/new'
    this.router.navigate([route])
  }

  editSurvey(survey: Survey): void {
    const basePath = this.isSPVRoute ? '/app/home/spv/peer-validation/edit' : '/app/home/peer-validation/edit'
    this.router.navigate([basePath, survey.id])
  }

  deleteSurvey(survey: Survey): void {
    // Implement delete logic
    console.log('Delete survey:', survey.id)
  }

  downloadExcel(survey: Survey): void {
    // Implement Excel download logic
    console.log('Download Excel for survey:', survey.id)
    // Example: this.surveyService.downloadExcel(survey.id).subscribe(...)
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active'
      case 'DRAFT':
        return 'status-draft'
      case 'END':
        return 'status-end'
      default:
        return ''
    }
  }
}
