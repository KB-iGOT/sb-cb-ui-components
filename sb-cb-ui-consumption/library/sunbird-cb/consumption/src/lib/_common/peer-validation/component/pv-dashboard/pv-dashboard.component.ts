import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { Router, ActivatedRoute } from '@angular/router'

interface Survey {
  id: string
  courseName: string
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
  styleUrls: ['./pv-dashboard.component.scss']
})
export class PvDashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator

  filterForm!: FormGroup
  displayedColumns: string[] = ['courseName', 'status', 'startDate', 'endDate', 'submissionRate', 'actions']
  dataSource = new MatTableDataSource<Survey>([])
  selectedTabIndex = 0
  totalCount = 42
  allCount = 100
  activeCount = 25
  endedCount = 50
  draftCount = 25

  statusOptions = ['All Status', 'Active', 'Draft', 'Ended']

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
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
        this.selectedTabIndex = tabMap[params['tab']] || 0
      }
    })
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({
      searchText: [''],
      startDate: [''],
      endDate: [''],
      status: ['All Status']
    })
  }

  loadSurveys(): void {
    // Mock data - replace with actual API call
    const mockData: Survey[] = [
      {
        id: '1',
        courseName: 'Peer Feedback - Q4 2024',
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
        status: 'ACTIVE',
        startDate: 'Nov 20, 2023',
        endDate: 'Nov 20, 2023',
        submissionRate: '60%',
        submissionCount: 6,
        totalCount: 10
      }
    ]

    this.dataSource = new MatTableDataSource(mockData)
    this.dataSource.paginator = this.paginator
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index

    // Map index to tab name and update query params
    const tabNames = ['all', 'active', 'ended', 'draft']
    const tabName = tabNames[index] || 'all'

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabName },
      queryParamsHandling: 'merge'
    })

    // Filter data based on tab
    // Implement filtering logic here
  }

  onSearch(): void {
    // Implement search logic here
    console.log('Filters:', this.filterForm.value)
  }

  createNewSurvey(): void {
    this.router.navigate(['/app/home/peer-validation/new'])
  }

  editSurvey(survey: Survey): void {
    this.router.navigate(['/app/home/peer-validation/edit', survey.id])
  }

  deleteSurvey(survey: Survey): void {
    // Implement delete logic
    console.log('Delete survey:', survey.id)
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
