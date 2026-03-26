import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewChild, Injector } from '@angular/core'
import { InsiteDataService } from '../../../_services/insite-data.service'

@Component({
  selector: 'sb-uic-mdo-leaderboard-v2',
  templateUrl: './mdo-leaderboard-v2.component.html',
  styleUrls: ['./mdo-leaderboard-v2.component.scss']
})
export class MdoLeaderboardV2Component implements OnInit, OnChanges {

  currentPill: any = 'XL'
  result: any = []
  filteredData: any
  searchTerm: string = ''
  expand: boolean = true
  disableLeft: boolean = true
  disableRight: boolean = false
  @Input() orgId: any = ''

  @Input() object: any
  @Input() slwConfig: any = {}
  @Input() isEdit: boolean = false
  @Input() isEditable: boolean = false
  @Output() tabClicked = new EventEmitter<any>()
  @Output() editClicked = new EventEmitter<any>()
  @ViewChild('scrollableContent', { static: false }) scrollableContent: ElementRef

  /** Top-level tab support (Center / State) */
  hasTabs = false
  activeTopTab: any = null
  activeTopTabIndex = 0

  private eventCallback: Function | undefined

  constructor(
    private insiteDataService: InsiteDataService,
    private injector: Injector
  ) {
    try {
      const isEditInput = this.injector.get('isEdit', false)
      const isEditableInput = this.injector.get('isEditable', false)
      const eventCallbackInput = this.injector.get('eventCallback', null)

      if (typeof isEditInput === 'boolean') {
        this.isEdit = isEditInput
      }
      if (typeof isEditableInput === 'boolean') {
        this.isEditable = isEditableInput
      }
      if (eventCallbackInput && typeof eventCallbackInput === 'function') {
        this.eventCallback = eventCallbackInput
      }
    } catch (e) {
      console.error('Error getting values from injector', e)
    }
  }

  ngOnInit() {
    this.initFromObject()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.object && !changes.object.firstChange) {
      this.initFromObject()
    }
  }

  private initFromObject() {
    debugger
    if (!this.object) {
      return
    }

    this.hasTabs = !!(this.object?.tabs && this.object.tabs.length > 0)

    if (this.hasTabs) {
      // Resolve initial top tab from object.currentTabIndex (e.g. 0 = Center, 1 = State)
      const idx = this.object.currentTabIndex
      this.activeTopTabIndex = (typeof idx === 'number' && idx >= 0 && idx < this.object.tabs.length) ? idx : 0
      this.activeTopTab = this.object.tabs[this.activeTopTabIndex]

      // Resolve initial pill from object.currentPill (e.g. "S", "M", "L")
      this.currentPill = this.object.currentPill || this.activeTopTab.options?.[0]?.value || this.currentPill
    } else {
      this.currentPill = this.object.currentPill || this.currentPill
    }

    if (this.slwConfig && this.slwConfig.enabled) {
      this.getSlwData()
    } else {
      this.getData()
    }
  }

  getSlwData() {
    const request = { request: { mdoId: this.orgId } }
    this.insiteDataService.fetchSlwLeaderboard(request).subscribe((res: any) => {
      if (res && res.result) {
        this.result = res.result
        this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
      }
    }, _error => {})
  }

  getData() {
    this.insiteDataService.fetchLeaderboardV2().subscribe((res: any) => {
      if (res && res.result) {
        this.result = {
        "mdoLeaderBoard": [
            {
                "is_state": false,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01359469147919155298",
                "total_points": 10,
                "row_num": 1,
                "total_users": 1649,
                "org_name": "Ministry of Law and Justice"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01380495595397120010",
                "total_points": null,
                "row_num": 2,
                "total_users": 3,
                "org_name": "Ministry of Shipping"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013838893368139776252",
                "total_points": null,
                "row_num": 3,
                "total_users": 3,
                "org_name": "Radhesh CBP"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013840212060848128285",
                "total_points": null,
                "row_num": 4,
                "total_users": 3,
                "org_name": "Central Industrial Security Force (CISF)"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01379920524722995212",
                "total_points": null,
                "row_num": 5,
                "total_users": 3,
                "org_name": "Southern Railway"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013685311953264640133",
                "total_points": null,
                "row_num": 6,
                "total_users": 3,
                "org_name": "DG of Defence Estate"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01359044257562624066",
                "total_points": null,
                "row_num": 7,
                "total_users": 3,
                "org_name": "Cochin University of Science and Technology (CUSAT)"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01376813510499532857",
                "total_points": null,
                "row_num": 8,
                "total_users": 3,
                "org_name": "U.P. Academy of Administration & Management (UPAAM) Govt. of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "0135785268271513607",
                "total_points": null,
                "row_num": 9,
                "total_users": 3,
                "org_name": "DELHI"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013837462555222016184",
                "total_points": null,
                "row_num": 10,
                "total_users": 3,
                "org_name": "Telaangana"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "0138036005433098242",
                "total_points": null,
                "row_num": 11,
                "total_users": 3,
                "org_name": "Tarang Sanchar Portal by Department of Telecommunications (DoT)"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013837484744278016193",
                "total_points": null,
                "row_num": 12,
                "total_users": 3,
                "org_name": "Employees State Insuarnce Corporation"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01359044375616716872",
                "total_points": null,
                "row_num": 13,
                "total_users": 3,
                "org_name": "MEGHALAYA"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01383336842061414497",
                "total_points": null,
                "row_num": 14,
                "total_users": 3,
                "org_name": "Ministry of Commerce and Industry"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013738426584842240110",
                "total_points": null,
                "row_num": 15,
                "total_users": 3,
                "org_name": "Rural Diksha Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01381906997392179224",
                "total_points": null,
                "row_num": 16,
                "total_users": 3,
                "org_name": "Department of Expenditure"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013846004568539136107",
                "total_points": null,
                "row_num": 17,
                "total_users": 3,
                "org_name": "Ministry of Railway"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "0135791278113095686",
                "total_points": null,
                "row_num": 18,
                "total_users": 3,
                "org_name": "General Administration Ladakh"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01382408888970444844",
                "total_points": null,
                "row_num": 19,
                "total_users": 3,
                "org_name": "Directorate General of Training"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01374911668681113626",
                "total_points": null,
                "row_num": 20,
                "total_users": 3,
                "org_name": "Ministry of data"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013633098358669312185",
                "total_points": null,
                "row_num": 21,
                "total_users": 3,
                "org_name": "OFFICE OF CHIEF CONTROLLER OF ACCOUNT"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "0135054866668503042",
                "total_points": null,
                "row_num": 22,
                "total_users": 3,
                "org_name": "spv portal dept"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01373837973956198497",
                "total_points": null,
                "row_num": 23,
                "total_users": 3,
                "org_name": "CBP-digital India"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "0134892390443581443",
                "total_points": null,
                "row_num": 24,
                "total_users": 3,
                "org_name": "testcbp"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013704327184826368217",
                "total_points": null,
                "row_num": 25,
                "total_users": 3,
                "org_name": "Indian Air Force"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01379298447061811241",
                "total_points": null,
                "row_num": 26,
                "total_users": 3,
                "org_name": "Ministry of Water Resources River Development and Ganga Rejuvenation"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01382199056048128031",
                "total_points": null,
                "row_num": 27,
                "total_users": 3,
                "org_name": "Rajya Sabha Secretariat"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01367546072115609633",
                "total_points": null,
                "row_num": 28,
                "total_users": 3,
                "org_name": "National Judicial Academy Bhopal"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01357853124168089610",
                "total_points": null,
                "row_num": 29,
                "total_users": 3,
                "org_name": "Kiru HEP CVPPPL"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013827565830537216583",
                "total_points": null,
                "row_num": 30,
                "total_users": 3,
                "org_name": "Indian Coast Guard"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "013866623533744128310",
                "total_points": null,
                "row_num": 31,
                "total_users": 3,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "L",
                "last_credit_date": null,
                "org_id": "01360689582162739276",
                "total_points": null,
                "row_num": 32,
                "total_users": 3,
                "org_name": "Department of Personnel and Training"
            },
            {
                "is_state": false,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013827571756179456586",
                "total_points": 10,
                "row_num": 1,
                "total_users": 922,
                "org_name": "test bulk upload"
            },
            {
                "is_state": false,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01379305664500531251",
                "total_points": 0,
                "row_num": 2,
                "total_users": 938,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013866596325040128300",
                "total_points": null,
                "row_num": 3,
                "total_users": 2,
                "org_name": "cbp testing CC CR CP"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0132245461338112000",
                "total_points": null,
                "row_num": 4,
                "total_users": 2,
                "org_name": "karmayogi"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0141185267421347840",
                "total_points": null,
                "row_num": 5,
                "total_users": 2,
                "org_name": "Mahesh MDO GCP"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01374684479621529610",
                "total_points": null,
                "row_num": 6,
                "total_users": 2,
                "org_name": "National informatic center"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01386730483877478413",
                "total_points": null,
                "row_num": 7,
                "total_users": 2,
                "org_name": "QATestingKB"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013826786604965888167",
                "total_points": null,
                "row_num": 8,
                "total_users": 2,
                "org_name": "Karnataka state New"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01379306818103705656",
                "total_points": null,
                "row_num": 9,
                "total_users": 2,
                "org_name": "Sikkim state"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01361099925757132897",
                "total_points": null,
                "row_num": 10,
                "total_users": 2,
                "org_name": "PWRMDC Ltd"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013783781194629120122",
                "total_points": null,
                "row_num": 11,
                "total_users": 2,
                "org_name": "MoD Sectt"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01385812209356800030",
                "total_points": null,
                "row_num": 12,
                "total_users": 2,
                "org_name": "Information Technology and Electronics Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01372712784031744032",
                "total_points": null,
                "row_num": 13,
                "total_users": 2,
                "org_name": "Office of the Commissioner"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013500699894439936287",
                "total_points": null,
                "row_num": 14,
                "total_users": 2,
                "org_name": "testcbpmarch"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013834026787315712115",
                "total_points": null,
                "row_num": 15,
                "total_users": 2,
                "org_name": "SURVEY OF INDIA"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01361099635102515295",
                "total_points": null,
                "row_num": 16,
                "total_users": 2,
                "org_name": "PUNJAB"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013627397001453568158",
                "total_points": null,
                "row_num": 17,
                "total_users": 2,
                "org_name": "Arth Evam Sankhya Prabhag"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013634326241591296189",
                "total_points": null,
                "row_num": 18,
                "total_users": 2,
                "org_name": "Films Division Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01385870092979404865",
                "total_points": null,
                "row_num": 19,
                "total_users": 2,
                "org_name": "Planning Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013866571430404096291",
                "total_points": null,
                "row_num": 20,
                "total_users": 2,
                "org_name": "cbp-new delhi"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0139126943544197126",
                "total_points": null,
                "row_num": 21,
                "total_users": 2,
                "org_name": "Ministry of Sportz"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013841115205222400305",
                "total_points": null,
                "row_num": 22,
                "total_users": 2,
                "org_name": "Department of Pharmaceuticals"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013793800231510016133",
                "total_points": null,
                "row_num": 23,
                "total_users": 2,
                "org_name": "Tripura State Electricity Corporation Limited"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01359131910031769679",
                "total_points": null,
                "row_num": 24,
                "total_users": 2,
                "org_name": "JAMMU & KASHMIR"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01379226738616729622",
                "total_points": null,
                "row_num": 25,
                "total_users": 2,
                "org_name": "Rail Budget 2016 Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013694620504326144197",
                "total_points": null,
                "row_num": 26,
                "total_users": 2,
                "org_name": "Ministry of Textiles"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01385373526314188813",
                "total_points": null,
                "row_num": 27,
                "total_users": 2,
                "org_name": "Labour Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135394856342896646",
                "total_points": null,
                "row_num": 28,
                "total_users": 2,
                "org_name": "Igot Mdo"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01359044011375001658",
                "total_points": null,
                "row_num": 29,
                "total_users": 2,
                "org_name": "S N Bose National Centre for Basic Sciences (SNBNCBS)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01358067059907788810",
                "total_points": null,
                "row_num": 30,
                "total_users": 2,
                "org_name": "Assam Energy Development Agency (AEDA)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135806584098570246",
                "total_points": null,
                "row_num": 31,
                "total_users": 2,
                "org_name": "AIR INDIA LTD"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01360673915855667266",
                "total_points": null,
                "row_num": 32,
                "total_users": 2,
                "org_name": "NA (PMO)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01366908440266342441",
                "total_points": null,
                "row_num": 33,
                "total_users": 2,
                "org_name": "Controller General of Accounts (CGA)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01376823579100774472",
                "total_points": null,
                "row_num": 34,
                "total_users": 2,
                "org_name": "water resource"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135366664642232328",
                "total_points": null,
                "row_num": 35,
                "total_users": 2,
                "org_name": "Open Source Tech Dev"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01385594531063398413",
                "total_points": null,
                "row_num": 36,
                "total_users": 2,
                "org_name": "Khadi and Village Indutries Commission (KVIC)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01380640918328115220",
                "total_points": null,
                "row_num": 37,
                "total_users": 2,
                "org_name": "Chennai Port Trust"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0140853914159759362",
                "total_points": null,
                "row_num": 38,
                "total_users": 2,
                "org_name": "Rajasthan"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135359738922352645",
                "total_points": null,
                "row_num": 39,
                "total_users": 2,
                "org_name": "ostd"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013699387929051136203",
                "total_points": null,
                "row_num": 40,
                "total_users": 2,
                "org_name": "Office of JS and Chief Administrative Officer"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01376825947137638478",
                "total_points": null,
                "row_num": 41,
                "total_users": 2,
                "org_name": "Comptroller and Auditor General (CAG) of India"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01357986184999731216",
                "total_points": null,
                "row_num": 42,
                "total_users": 2,
                "org_name": "Medical Education Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01358336744676556821",
                "total_points": null,
                "row_num": 43,
                "total_users": 2,
                "org_name": "ARUNACHAL PRADESH"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013640725777645568308",
                "total_points": null,
                "row_num": 44,
                "total_users": 2,
                "org_name": "General Administration Department Meghalaya"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01374905340651929624",
                "total_points": null,
                "row_num": 45,
                "total_users": 2,
                "org_name": "ODISHA"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01359467868939878491",
                "total_points": null,
                "row_num": 46,
                "total_users": 2,
                "org_name": "Gulbarga Electricity Supply Company (GESCOM)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01376824514990080075",
                "total_points": null,
                "row_num": 47,
                "total_users": 2,
                "org_name": "criminal law"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013842418804776960360",
                "total_points": null,
                "row_num": 48,
                "total_users": 2,
                "org_name": "Testing Ministry"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01374897031639859217",
                "total_points": null,
                "row_num": 49,
                "total_users": 2,
                "org_name": "Central Power Research Institute (CPRI) Bangalore Karnataka"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01384825888804864076",
                "total_points": null,
                "row_num": 50,
                "total_users": 2,
                "org_name": "Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013857947568422912106",
                "total_points": null,
                "row_num": 51,
                "total_users": 2,
                "org_name": "Parliamentary Affairs Department Mantralaya"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013693149388513280187",
                "total_points": null,
                "row_num": 52,
                "total_users": 2,
                "org_name": "National Authority for Chemical Weapons Convention (NACWC)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01385304990398873613",
                "total_points": null,
                "row_num": 53,
                "total_users": 2,
                "org_name": "Department of Financial Services"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01379300286193664044",
                "total_points": null,
                "row_num": 54,
                "total_users": 2,
                "org_name": "Department of Consumer Affairs"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01376743249867571249",
                "total_points": null,
                "row_num": 55,
                "total_users": 2,
                "org_name": "Autonomous Body"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01384392945143808064",
                "total_points": null,
                "row_num": 56,
                "total_users": 2,
                "org_name": "Ministry of Sports"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01359342801614438486",
                "total_points": null,
                "row_num": 57,
                "total_users": 2,
                "org_name": "Project Progress Monitoring System"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135954357612625920",
                "total_points": null,
                "row_num": 58,
                "total_users": 2,
                "org_name": "NTPC Tamilnadu Energy Company Ltd"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013837440604364800177",
                "total_points": null,
                "row_num": 59,
                "total_users": 2,
                "org_name": "Tel1"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013826229980823552144",
                "total_points": null,
                "row_num": 60,
                "total_users": 2,
                "org_name": "Press Information Bureau (PIB)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0134900214601072649",
                "total_points": null,
                "row_num": 61,
                "total_users": 2,
                "org_name": "testmdoa"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013842343116251136339",
                "total_points": null,
                "row_num": 62,
                "total_users": 2,
                "org_name": "Directorate General of Quality Assurance ( DGQA)"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0139543696241049600",
                "total_points": null,
                "row_num": 63,
                "total_users": 2,
                "org_name": "UI Development Ministry"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01358981243515699250",
                "total_points": null,
                "row_num": 64,
                "total_users": 2,
                "org_name": "BIHAR"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0135806517433139202",
                "total_points": null,
                "row_num": 65,
                "total_users": 2,
                "org_name": "NTPC LTD"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013704368151273472219",
                "total_points": null,
                "row_num": 66,
                "total_users": 2,
                "org_name": "South Campus Library"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013811399621681152122",
                "total_points": null,
                "row_num": 67,
                "total_users": 2,
                "org_name": "Mumbai Port Trust"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "013682563489357824113",
                "total_points": null,
                "row_num": 68,
                "total_users": 2,
                "org_name": "DG Armed Forces Medical Service"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "0138185088774881289",
                "total_points": null,
                "row_num": 69,
                "total_users": 2,
                "org_name": "CSIR Central Institute of Mining Fuel Research"
            },
            {
                "is_state": true,
                "size": "M",
                "last_credit_date": null,
                "org_id": "01358632512033587228",
                "total_points": null,
                "row_num": 70,
                "total_users": 2,
                "org_name": "Delhi District Courts"
            },
            {
                "is_state": false,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013694419603603456193",
                "total_points": 10,
                "row_num": 1,
                "total_users": 231,
                "org_name": "Ministry of Communications"
            },
            {
                "is_state": false,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384675536621568015",
                "total_points": 0,
                "row_num": 2,
                "total_users": 383,
                "org_name": "TarentoMDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379305664500531251",
                "total_points": null,
                "row_num": 3,
                "total_users": 635,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134156658793594880",
                "total_points": null,
                "row_num": 4,
                "total_users": 679,
                "org_name": "Department of Telecommunications DOT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135790980132372480",
                "total_points": null,
                "row_num": 5,
                "total_users": 5,
                "org_name": "OFFICE OF THE PROTECTOR OF EMIGRANTS VIDESH BHAVAN"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359911567899033615",
                "total_points": null,
                "row_num": 6,
                "total_users": 5,
                "org_name": "Department of Economic Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013635016947286016192",
                "total_points": null,
                "row_num": 7,
                "total_users": 5,
                "org_name": "Ministry of Agriculture and Farmers Welfare"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01387565009760256087",
                "total_points": null,
                "row_num": 8,
                "total_users": 1,
                "org_name": "Government Polytechnic Ratnagiri"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01353676035393126415",
                "total_points": null,
                "row_num": 9,
                "total_users": 9,
                "org_name": "Open Source Tech Dev CBP Provider"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137442086132203521",
                "total_points": null,
                "row_num": 10,
                "total_users": 1,
                "org_name": "BAY OF BENGAL"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866575265136640289",
                "total_points": null,
                "row_num": 11,
                "total_users": 1,
                "org_name": "Testing New Delhi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385305747483033618",
                "total_points": null,
                "row_num": 12,
                "total_users": 1,
                "org_name": "Water Resources Department Maharashtra"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376238589099212843",
                "total_points": null,
                "row_num": 13,
                "total_users": 1,
                "org_name": "National Skill Training Institute for Women"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137921146925056009",
                "total_points": null,
                "row_num": 14,
                "total_users": 1,
                "org_name": "National Council for Hotel Management and Catering Technology (NCHMCT)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139260708968529920",
                "total_points": null,
                "row_num": 15,
                "total_users": 3,
                "org_name": "Gramener"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01367545353202892831",
                "total_points": null,
                "row_num": 16,
                "total_users": 1,
                "org_name": "Metropolitan Magistrates Court"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135785230328381448",
                "total_points": null,
                "row_num": 17,
                "total_users": 6,
                "org_name": "POWERGRID CORPORATION OF INDIA LIMITED"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01354015307459788827",
                "total_points": null,
                "row_num": 18,
                "total_users": 2,
                "org_name": "Test MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385101666774220845",
                "total_points": null,
                "row_num": 19,
                "total_users": 1,
                "org_name": "Presidents Secretariat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139470122340352009",
                "total_points": null,
                "row_num": 20,
                "total_users": 1,
                "org_name": "Central Railside Warehouse Company Ltd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140801732728668160",
                "total_points": null,
                "row_num": 21,
                "total_users": 1,
                "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379847820362547216",
                "total_points": null,
                "row_num": 22,
                "total_users": 21,
                "org_name": "Office of the Registrar General and Census Commissioner Census of India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866596325040128300",
                "total_points": null,
                "row_num": 23,
                "total_users": 2,
                "org_name": "cbp testing CC CR CP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384396684571443276",
                "total_points": null,
                "row_num": 24,
                "total_users": 1,
                "org_name": "Ministry of Information and Technology"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013793625915031552122",
                "total_points": null,
                "row_num": 25,
                "total_users": 1,
                "org_name": "Electronic Media Monitoring Center (EMMC) Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01377820590049689621",
                "total_points": null,
                "row_num": 26,
                "total_users": 1,
                "org_name": "BIHAR LEGISLATIVE COUNCIL"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379229387156684826",
                "total_points": null,
                "row_num": 27,
                "total_users": 17,
                "org_name": "Defence Research and Development Organisation (DRDO)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379311867052032072",
                "total_points": null,
                "row_num": 28,
                "total_users": 1,
                "org_name": "Sampledeptkata"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385255992637849611",
                "total_points": null,
                "row_num": 29,
                "total_users": 1,
                "org_name": "Panchayat Raj and Rural Development Department Telangana"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013635898769596416219",
                "total_points": null,
                "row_num": 30,
                "total_users": 1,
                "org_name": "Performance Management Division (PMD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132245461338112000",
                "total_points": null,
                "row_num": 31,
                "total_users": 2,
                "org_name": "karmayogi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01326127402578739228",
                "total_points": null,
                "row_num": 32,
                "total_users": 8,
                "org_name": "Ministry of Networks"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0141185267421347840",
                "total_points": null,
                "row_num": 33,
                "total_users": 2,
                "org_name": "Mahesh MDO GCP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013873027489333248314",
                "total_points": null,
                "row_num": 34,
                "total_users": 1,
                "org_name": "Kerala House"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01390203930746880027",
                "total_points": null,
                "row_num": 35,
                "total_users": 4,
                "org_name": "University Grants Commission  "
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380495595397120010",
                "total_points": null,
                "row_num": 36,
                "total_users": 3,
                "org_name": "Ministry of Shipping"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01325419073593344035",
                "total_points": null,
                "row_num": 37,
                "total_users": 1,
                "org_name": null
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359823173205196811",
                "total_points": null,
                "row_num": 38,
                "total_users": 1,
                "org_name": "Rafi Ahmed Kidwai National Postal Academy (RAKNPA) Ghaziabad Uttarpradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374684479621529610",
                "total_points": null,
                "row_num": 39,
                "total_users": 2,
                "org_name": "National informatic center"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01386730483877478413",
                "total_points": null,
                "row_num": 40,
                "total_users": 2,
                "org_name": "QATestingKB"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838893368139776252",
                "total_points": null,
                "row_num": 41,
                "total_users": 3,
                "org_name": "Radhesh CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384741330363187245",
                "total_points": null,
                "row_num": 42,
                "total_users": 1,
                "org_name": "Ecommittee Supreme Court of India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384742629584896049",
                "total_points": null,
                "row_num": 43,
                "total_users": 1,
                "org_name": "ATI KARNATAKA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013827571756179456586",
                "total_points": null,
                "row_num": 44,
                "total_users": 924,
                "org_name": "test bulk upload"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379920039446118410",
                "total_points": null,
                "row_num": 45,
                "total_users": 1,
                "org_name": "Bureau of Police Research & Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01354015402707353625",
                "total_points": null,
                "row_num": 46,
                "total_users": 1,
                "org_name": "Test CBP Provider"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838890322845696254",
                "total_points": null,
                "row_num": 47,
                "total_users": 9,
                "org_name": "Deepak CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013417727046164480667",
                "total_points": null,
                "row_num": 48,
                "total_users": 14,
                "org_name": "NACIN National Academy of Customs Indirect Taxes and Narcotics"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013826786604965888167",
                "total_points": null,
                "row_num": 49,
                "total_users": 2,
                "org_name": "Karnataka state New"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358337021011558422",
                "total_points": null,
                "row_num": 50,
                "total_users": 4,
                "org_name": "GOA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379306818103705656",
                "total_points": null,
                "row_num": 51,
                "total_users": 2,
                "org_name": "Sikkim state"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382344192448102415",
                "total_points": null,
                "row_num": 52,
                "total_users": 1,
                "org_name": "Department of Industrial Policy and Promotion"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013797206673039360219",
                "total_points": null,
                "row_num": 53,
                "total_users": 2,
                "org_name": "Ministry of Tourism"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013846225261092864126",
                "total_points": null,
                "row_num": 54,
                "total_users": 1,
                "org_name": "Ministry of finance once"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013614657438236672114",
                "total_points": null,
                "row_num": 55,
                "total_users": 1,
                "org_name": "Deputy Commissioner Office Kokrajhar"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132592991964119040",
                "total_points": null,
                "row_num": 56,
                "total_users": 6,
                "org_name": "Coursetest"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376822910112563268",
                "total_points": null,
                "row_num": 57,
                "total_users": 210,
                "org_name": "TarentoMDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132593133014138882",
                "total_points": null,
                "row_num": 58,
                "total_users": 14,
                "org_name": "LABSANA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134892964190453767",
                "total_points": null,
                "row_num": 59,
                "total_users": 1,
                "org_name": "myorgseven"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134892251385774080",
                "total_points": null,
                "row_num": 60,
                "total_users": 1,
                "org_name": "testmdo"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013840212060848128285",
                "total_points": null,
                "row_num": 61,
                "total_users": 3,
                "org_name": "Central Industrial Security Force (CISF)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013594797502660608102",
                "total_points": null,
                "row_num": 62,
                "total_users": 4,
                "org_name": "Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013694419603603456193",
                "total_points": null,
                "row_num": 63,
                "total_users": 8,
                "org_name": "Ministry of Communications"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01361099925757132897",
                "total_points": null,
                "row_num": 64,
                "total_users": 2,
                "org_name": "PWRMDC Ltd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013797308466028544225",
                "total_points": null,
                "row_num": 65,
                "total_users": 1,
                "org_name": "National Career Service Center For Differently Abl"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366549425179852814",
                "total_points": null,
                "row_num": 66,
                "total_users": 4,
                "org_name": "Allahabad Nagar Nigam"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013783781194629120122",
                "total_points": null,
                "row_num": 67,
                "total_users": 2,
                "org_name": "MoD Sectt"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044133256396862",
                "total_points": null,
                "row_num": 68,
                "total_users": 1,
                "org_name": "CBFC"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385812209356800030",
                "total_points": null,
                "row_num": 69,
                "total_users": 2,
                "org_name": "Information Technology and Electronics Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01353949615398092815",
                "total_points": null,
                "row_num": 70,
                "total_users": 10,
                "org_name": "Igot CBP Provider"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379929322870374431",
                "total_points": null,
                "row_num": 71,
                "total_users": 18,
                "org_name": "Employees Provident Fund Organisation (EPFO)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140788863598264326",
                "total_points": null,
                "row_num": 72,
                "total_users": 6,
                "org_name": "Tarento CBP Provider"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379920524722995212",
                "total_points": null,
                "row_num": 73,
                "total_users": 3,
                "org_name": "Southern Railway"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372712784031744032",
                "total_points": null,
                "row_num": 74,
                "total_users": 2,
                "org_name": "Office of the Commissioner"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0141646311855226882",
                "total_points": null,
                "row_num": 75,
                "total_users": 1,
                "org_name": "Organisation of Chase Wintheiser"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358917379604480048",
                "total_points": null,
                "row_num": 76,
                "total_users": 1,
                "org_name": "Ministry of Culture"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013500699894439936287",
                "total_points": null,
                "row_num": 77,
                "total_users": 2,
                "org_name": "testcbpmarch"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013638046465564672269",
                "total_points": null,
                "row_num": 78,
                "total_users": 4,
                "org_name": "NJHPS SJVN LTD"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01377743336031846411",
                "total_points": null,
                "row_num": 79,
                "total_users": 1,
                "org_name": "Diesel Locomotive Works Varanasi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382399527587840031",
                "total_points": null,
                "row_num": 80,
                "total_users": 1,
                "org_name": "Forest and Environment Department Odisha"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379305664500531251",
                "total_points": null,
                "row_num": 81,
                "total_users": 637,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01390265150373068829",
                "total_points": null,
                "row_num": 82,
                "total_users": 1,
                "org_name": "Shellac and Forest Products Export Promotion Council Kolkata"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376187695259648041",
                "total_points": null,
                "row_num": 83,
                "total_users": 11,
                "org_name": "Indian Council of Medical Research (ICMR)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385598264709120020",
                "total_points": null,
                "row_num": 84,
                "total_users": 1,
                "org_name": "Sai State"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380136308844134454",
                "total_points": null,
                "row_num": 85,
                "total_users": 1,
                "org_name": "Ministry of Earth Sciences"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140846146226176001",
                "total_points": null,
                "row_num": 86,
                "total_users": 1,
                "org_name": "Biharrr"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013834026787315712115",
                "total_points": null,
                "row_num": 87,
                "total_users": 2,
                "org_name": "SURVEY OF INDIA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385175097608601693",
                "total_points": null,
                "row_num": 88,
                "total_users": 1,
                "org_name": "Western Coalfields Ltd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013857942434496512101",
                "total_points": null,
                "row_num": 89,
                "total_users": 1,
                "org_name": "Central Public Works Department (CPWD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01361099635102515295",
                "total_points": null,
                "row_num": 90,
                "total_users": 2,
                "org_name": "PUNJAB"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358993109980774453",
                "total_points": null,
                "row_num": 91,
                "total_users": 1,
                "org_name": "DAMAN & DIU"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838328336261120236",
                "total_points": null,
                "row_num": 92,
                "total_users": 1,
                "org_name": "Indian Railway Stations Development Corporation Limited"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013627397001453568158",
                "total_points": null,
                "row_num": 93,
                "total_users": 2,
                "org_name": "Arth Evam Sankhya Prabhag"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013685311953264640133",
                "total_points": null,
                "row_num": 94,
                "total_users": 3,
                "org_name": "DG of Defence Estate"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376252146242355245",
                "total_points": null,
                "row_num": 95,
                "total_users": 1,
                "org_name": "OFFICE OF THE DGADS NEW DELHI"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013633061006516224182",
                "total_points": null,
                "row_num": 96,
                "total_users": 1,
                "org_name": "e-Suvidha A Public Utility Interface"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013634326241591296189",
                "total_points": null,
                "row_num": 97,
                "total_users": 2,
                "org_name": "Films Division Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366841101891993635",
                "total_points": null,
                "row_num": 98,
                "total_users": 1,
                "org_name": "Directorate of Handloom and Textiles Government of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013784505342812160151",
                "total_points": null,
                "row_num": 99,
                "total_users": 4,
                "org_name": "Department of Legal Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359131823008153684",
                "total_points": null,
                "row_num": 100,
                "total_users": 1,
                "org_name": "DADRA & NAGAR HAVELI"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384676855374643222",
                "total_points": null,
                "row_num": 101,
                "total_users": 4,
                "org_name": "Radhesh MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385870092979404865",
                "total_points": null,
                "row_num": 102,
                "total_users": 2,
                "org_name": "Planning Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132238763297177601",
                "total_points": null,
                "row_num": 103,
                "total_users": 831,
                "org_name": "igot"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044257562624066",
                "total_points": null,
                "row_num": 104,
                "total_users": 3,
                "org_name": "Cochin University of Science and Technology (CUSAT)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372713621613772834",
                "total_points": null,
                "row_num": 105,
                "total_users": 1,
                "org_name": "OFFICE OF THE AG AUDIT TRIPURA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866571430404096291",
                "total_points": null,
                "row_num": 106,
                "total_users": 2,
                "org_name": "cbp-new delhi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013852394237181952107",
                "total_points": null,
                "row_num": 107,
                "total_users": 1,
                "org_name": "Home Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359469147919155298",
                "total_points": null,
                "row_num": 108,
                "total_users": 1,
                "org_name": "Ministry of Law and Justice"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134476525713326087",
                "total_points": null,
                "row_num": 109,
                "total_users": 1,
                "org_name": "Personnel  and  Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359045143774822474",
                "total_points": null,
                "row_num": 110,
                "total_users": 10,
                "org_name": "AAICLAS"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139126943544197126",
                "total_points": null,
                "row_num": 111,
                "total_users": 2,
                "org_name": "Ministry of Sportz"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013620438976643072137",
                "total_points": null,
                "row_num": 112,
                "total_users": 4,
                "org_name": "NA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132868817112842240",
                "total_points": null,
                "row_num": 113,
                "total_users": 4,
                "org_name": "Testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373706594001715274",
                "total_points": null,
                "row_num": 114,
                "total_users": 5,
                "org_name": "CPB Provider Testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044707876044868",
                "total_points": null,
                "row_num": 115,
                "total_users": 1,
                "org_name": "Higher Education Department Kerala"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01344769730810675214",
                "total_points": null,
                "row_num": 116,
                "total_users": 1,
                "org_name": "Training & Test"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372274107909734412",
                "total_points": null,
                "row_num": 117,
                "total_users": 1,
                "org_name": "National Institute of Public Cooperation and Child Development (NIPCCD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013841115205222400305",
                "total_points": null,
                "row_num": 118,
                "total_users": 2,
                "org_name": "Department of Pharmaceuticals"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140802491947827204",
                "total_points": null,
                "row_num": 119,
                "total_users": 1,
                "org_name": "Information and Broadcasting Department Gujarat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013690250168123392178",
                "total_points": null,
                "row_num": 120,
                "total_users": 37,
                "org_name": "Border Road Organisation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376813510499532857",
                "total_points": null,
                "row_num": 121,
                "total_users": 3,
                "org_name": "U.P. Academy of Administration & Management (UPAAM) Govt. of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013841111229448192306",
                "total_points": null,
                "row_num": 122,
                "total_users": 1,
                "org_name": "Ministry of Chemicals and Fertilizers"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013793800231510016133",
                "total_points": null,
                "row_num": 123,
                "total_users": 2,
                "org_name": "Tripura State Electricity Corporation Limited"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013787839365193728200",
                "total_points": null,
                "row_num": 124,
                "total_users": 1,
                "org_name": "Government Organization"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359131910031769679",
                "total_points": null,
                "row_num": 125,
                "total_users": 2,
                "org_name": "JAMMU & KASHMIR"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379226738616729622",
                "total_points": null,
                "row_num": 126,
                "total_users": 2,
                "org_name": "Rail Budget 2016 Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138558943525601288",
                "total_points": null,
                "row_num": 127,
                "total_users": 1,
                "org_name": "Parliamentary Affairs Department Maharashtra"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382411681533952068",
                "total_points": null,
                "row_num": 128,
                "total_users": 1,
                "org_name": "KARNATAKA TRADE PROMOTION ORGANIZATION"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013703646888394752207",
                "total_points": null,
                "row_num": 129,
                "total_users": 32,
                "org_name": "Food Corporation of India (FCI)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01388490495659212829",
                "total_points": null,
                "row_num": 130,
                "total_users": 1,
                "org_name": "Social Welfare (Sanik Kalyan) Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135785268271513607",
                "total_points": null,
                "row_num": 131,
                "total_users": 3,
                "org_name": "DELHI"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132620292584243200",
                "total_points": null,
                "row_num": 132,
                "total_users": 1,
                "org_name": "BESCOM"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134476592354099208",
                "total_points": null,
                "row_num": 133,
                "total_users": 1,
                "org_name": "KarthikTestCBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01405899873288192024",
                "total_points": null,
                "row_num": 134,
                "total_users": 1,
                "org_name": "Ministry of  Renewable energy resource"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01344766896078848010",
                "total_points": null,
                "row_num": 135,
                "total_users": 65,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358834130544230431",
                "total_points": null,
                "row_num": 136,
                "total_users": 6,
                "org_name": "North Eastern Regional Power Committee"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384311140161126413",
                "total_points": null,
                "row_num": 137,
                "total_users": 1,
                "org_name": "Department of Heavy Industry"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376822290813747263",
                "total_points": null,
                "row_num": 138,
                "total_users": 438,
                "org_name": "TarentoCBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373714214256640083",
                "total_points": null,
                "row_num": 139,
                "total_users": 5,
                "org_name": "sathya CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013837462555222016184",
                "total_points": null,
                "row_num": 140,
                "total_users": 3,
                "org_name": "Telaangana"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374897150722048016",
                "total_points": null,
                "row_num": 141,
                "total_users": 1,
                "org_name": "Southern Regional Power Committee"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013417772493185024682",
                "total_points": null,
                "row_num": 142,
                "total_users": 59,
                "org_name": "NIRDPR National Institute of Rural Development and Panchayati Raj"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013694620504326144197",
                "total_points": null,
                "row_num": 143,
                "total_users": 2,
                "org_name": "Ministry of Textiles"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044011375001658",
                "total_points": null,
                "row_num": 144,
                "total_users": 2,
                "org_name": "S N Bose National Centre for Basic Sciences (SNBNCBS)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385373526314188813",
                "total_points": null,
                "row_num": 145,
                "total_users": 2,
                "org_name": "Labour Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135394856342896646",
                "total_points": null,
                "row_num": 146,
                "total_users": 2,
                "org_name": "Igot Mdo"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384674984551219213",
                "total_points": null,
                "row_num": 147,
                "total_users": 368,
                "org_name": "Mahesh MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134157287914864641",
                "total_points": null,
                "row_num": 148,
                "total_users": 30,
                "org_name": "CBI Academy"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013845995847696384105",
                "total_points": null,
                "row_num": 149,
                "total_users": 1,
                "org_name": "Bharat Broadband Network Limited (BBNL)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359469224475852896",
                "total_points": null,
                "row_num": 150,
                "total_users": 1,
                "org_name": "The High Court of Judicature at Patna"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137202325057617923",
                "total_points": null,
                "row_num": 151,
                "total_users": 1,
                "org_name": "ESI Corporation Sub Regional Office Nagpur"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358067059907788810",
                "total_points": null,
                "row_num": 152,
                "total_users": 2,
                "org_name": "Assam Energy Development Agency (AEDA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379325777339187290",
                "total_points": null,
                "row_num": 153,
                "total_users": 1,
                "org_name": "GUJARAT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379307180892160061",
                "total_points": null,
                "row_num": 154,
                "total_users": 1,
                "org_name": "Finance_organisation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013594694782582784100",
                "total_points": null,
                "row_num": 155,
                "total_users": 1,
                "org_name": "LADAKH"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359043884062310460",
                "total_points": null,
                "row_num": 156,
                "total_users": 1,
                "org_name": "Intelligence Bureau"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384675536621568015",
                "total_points": null,
                "row_num": 157,
                "total_users": 88,
                "org_name": "Shankar MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135806584098570246",
                "total_points": null,
                "row_num": 158,
                "total_users": 2,
                "org_name": "AIR INDIA LTD"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01375683075607756827",
                "total_points": null,
                "row_num": 159,
                "total_users": 1,
                "org_name": "National Security Council"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373715147098521691",
                "total_points": null,
                "row_num": 160,
                "total_users": 1,
                "org_name": "MIZORAM"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140788510336040962",
                "total_points": null,
                "row_num": 161,
                "total_users": 46,
                "org_name": "Finance And Budget"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135962841564774408",
                "total_points": null,
                "row_num": 162,
                "total_users": 24,
                "org_name": "Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134892418324234245",
                "total_points": null,
                "row_num": 163,
                "total_users": 1,
                "org_name": "testcbpseven all"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138029617471488002",
                "total_points": null,
                "row_num": 164,
                "total_users": 1,
                "org_name": "QA organisation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379302709590425648",
                "total_points": null,
                "row_num": 165,
                "total_users": 1,
                "org_name": "Planning Commission (Archival Website)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138141926497320964",
                "total_points": null,
                "row_num": 166,
                "total_users": 1,
                "org_name": "Department of Defence Production"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138212612013998086",
                "total_points": null,
                "row_num": 167,
                "total_users": 1,
                "org_name": "National Institute of Social Defence (NISD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382344087628185614",
                "total_points": null,
                "row_num": 168,
                "total_users": 4,
                "org_name": "Controller General of Patents Designs and Trade Marks (CGPDTM) Mumbai"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013704373873598464221",
                "total_points": null,
                "row_num": 169,
                "total_users": 1,
                "org_name": "Civil Supplies and Consumer Affairs Department Andaman & Nicobar"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013704547956629504226",
                "total_points": null,
                "row_num": 170,
                "total_users": 1,
                "org_name": "Department of Agriculture Cooperation and Farmers Welfare"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360673915855667266",
                "total_points": null,
                "row_num": 171,
                "total_users": 2,
                "org_name": "NA (PMO)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01344770342046924817",
                "total_points": null,
                "row_num": 172,
                "total_users": 16,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366908440266342441",
                "total_points": null,
                "row_num": 173,
                "total_users": 2,
                "org_name": "Controller General of Accounts (CGA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013694500545683456195",
                "total_points": null,
                "row_num": 174,
                "total_users": 1,
                "org_name": "DG ATVP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138036005433098242",
                "total_points": null,
                "row_num": 175,
                "total_users": 3,
                "org_name": "Tarang Sanchar Portal by Department of Telecommunications (DoT)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013787900185239552202",
                "total_points": null,
                "row_num": 176,
                "total_users": 1,
                "org_name": "Finance Department Daman and Diu"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0136501458849792002",
                "total_points": null,
                "row_num": 177,
                "total_users": 5,
                "org_name": "Indian Army"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013846223295750144127",
                "total_points": null,
                "row_num": 178,
                "total_users": 1,
                "org_name": "department of revenue"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01387373162560716847",
                "total_points": null,
                "row_num": 179,
                "total_users": 1,
                "org_name": "Indian Institute of Public Administration (IIPA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013872231679262720217",
                "total_points": null,
                "row_num": 180,
                "total_users": 1,
                "org_name": "Ministry of Steel"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01397618173831577617",
                "total_points": null,
                "row_num": 181,
                "total_users": 7,
                "org_name": "Aparna MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137731899039252480",
                "total_points": null,
                "row_num": 182,
                "total_users": 4,
                "org_name": "test"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013793792274522112131",
                "total_points": null,
                "row_num": 183,
                "total_users": 1,
                "org_name": "Krishi Vigyan Kendra South Tripura"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140216632523161600",
                "total_points": null,
                "row_num": 184,
                "total_users": 1,
                "org_name": "ISB"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013846656088899584133",
                "total_points": null,
                "row_num": 185,
                "total_users": 1,
                "org_name": "Sai Test"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385736594736742483",
                "total_points": null,
                "row_num": 186,
                "total_users": 1,
                "org_name": "Ministry of Civil Aviation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01354383440999219234",
                "total_points": null,
                "row_num": 187,
                "total_users": 21,
                "org_name": "SundarCBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013707309556899840228",
                "total_points": null,
                "row_num": 188,
                "total_users": 4,
                "org_name": "Department of Defence"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013630916509294592179",
                "total_points": null,
                "row_num": 189,
                "total_users": 1,
                "org_name": "TRIPURA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013837484744278016193",
                "total_points": null,
                "row_num": 190,
                "total_users": 3,
                "org_name": "Employees State Insuarnce Corporation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013793584981893120116",
                "total_points": null,
                "row_num": 191,
                "total_users": 82,
                "org_name": "Employees State Insurance Corporation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134156658793594880",
                "total_points": null,
                "row_num": 192,
                "total_users": 679,
                "org_name": "Department of Telecommunications DOT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376823579100774472",
                "total_points": null,
                "row_num": 193,
                "total_users": 2,
                "org_name": "water resource"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013840971229683712298",
                "total_points": null,
                "row_num": 194,
                "total_users": 1,
                "org_name": "MSME Testing Station"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044375616716872",
                "total_points": null,
                "row_num": 195,
                "total_users": 3,
                "org_name": "MEGHALAYA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135366664642232328",
                "total_points": null,
                "row_num": 196,
                "total_users": 2,
                "org_name": "Open Source Tech Dev"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135792011403427849",
                "total_points": null,
                "row_num": 197,
                "total_users": 1,
                "org_name": "Delhi Parks and Gardens Society Department of Environment"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358903917383680037",
                "total_points": null,
                "row_num": 198,
                "total_users": 1,
                "org_name": "Department of PWD Assam"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384391432829337658",
                "total_points": null,
                "row_num": 199,
                "total_users": 1,
                "org_name": "REGIONAL TRAINING INSTITUTE NEW DELHI"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138290439635517441557",
                "total_points": null,
                "row_num": 200,
                "total_users": 1,
                "org_name": "Universal Service Obligation Fund (USOF)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385535463419904058",
                "total_points": null,
                "row_num": 201,
                "total_users": 6,
                "org_name": "Central Board of Direct Taxes (CBDT)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385594531063398413",
                "total_points": null,
                "row_num": 202,
                "total_users": 2,
                "org_name": "Khadi and Village Indutries Commission (KVIC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380640918328115220",
                "total_points": null,
                "row_num": 203,
                "total_users": 2,
                "org_name": "Chennai Port Trust"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01375680598713139225",
                "total_points": null,
                "row_num": 204,
                "total_users": 1,
                "org_name": "ATI MAHARASHTRA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358914361008947245",
                "total_points": null,
                "row_num": 205,
                "total_users": 1,
                "org_name": "HIMACHAL PRADESH"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138043201608089602",
                "total_points": null,
                "row_num": 206,
                "total_users": 49,
                "org_name": "RKCbp"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135956610592686083",
                "total_points": null,
                "row_num": 207,
                "total_users": 1,
                "org_name": "NA (DOR)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358129015016652813",
                "total_points": null,
                "row_num": 208,
                "total_users": 1,
                "org_name": "Airports Authority of India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013633005407862784180",
                "total_points": null,
                "row_num": 209,
                "total_users": 1,
                "org_name": "Ministry of Coal"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359693287062732810",
                "total_points": null,
                "row_num": 210,
                "total_users": 13,
                "org_name": "Department Of Posts"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385090604634931226",
                "total_points": null,
                "row_num": 211,
                "total_users": 1,
                "org_name": "Ministry of Housing and Urban Poverty Alleviation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139154529409433600",
                "total_points": null,
                "row_num": 212,
                "total_users": 1,
                "org_name": "RAJYA SAMPATTI NIDESHALAYA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013783094970023936103",
                "total_points": null,
                "row_num": 213,
                "total_users": 5,
                "org_name": "Ministry of Mines"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01383336842061414497",
                "total_points": null,
                "row_num": 214,
                "total_users": 3,
                "org_name": "Ministry of Commerce and Industry"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013738426584842240110",
                "total_points": null,
                "row_num": 215,
                "total_users": 3,
                "org_name": "Rural Diksha Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138212654081064967",
                "total_points": null,
                "row_num": 216,
                "total_users": 1,
                "org_name": "Department of Social Justice and Empowerment"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385186960937779298",
                "total_points": null,
                "row_num": 217,
                "total_users": 4,
                "org_name": "Sahil MDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01381906997392179224",
                "total_points": null,
                "row_num": 218,
                "total_users": 3,
                "org_name": "Department of Expenditure"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0140853914159759362",
                "total_points": null,
                "row_num": 219,
                "total_users": 2,
                "org_name": "Rajasthan"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374276245304934424",
                "total_points": null,
                "row_num": 220,
                "total_users": 1,
                "org_name": "AIR India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385606244985241623",
                "total_points": null,
                "row_num": 221,
                "total_users": 1,
                "org_name": "North Eastern Railway"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135359738922352645",
                "total_points": null,
                "row_num": 222,
                "total_users": 2,
                "org_name": "ostd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384739322653081641",
                "total_points": null,
                "row_num": 223,
                "total_users": 1,
                "org_name": "Ministry of Statistics and Programme Implementation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01353677983645696018",
                "total_points": null,
                "row_num": 224,
                "total_users": 4,
                "org_name": "OSTD CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013826080908025856107",
                "total_points": null,
                "row_num": 225,
                "total_users": 5,
                "org_name": "Ministry of testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013699387929051136203",
                "total_points": null,
                "row_num": 226,
                "total_users": 2,
                "org_name": "Office of JS and Chief Administrative Officer"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380153481512550414",
                "total_points": null,
                "row_num": 227,
                "total_users": 1,
                "org_name": "Institute For Design Of Electrical Measuring Instruments Mumbai"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01357986184999731216",
                "total_points": null,
                "row_num": 228,
                "total_users": 2,
                "org_name": "Medical Education Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376825947137638478",
                "total_points": null,
                "row_num": 229,
                "total_users": 2,
                "org_name": "Comptroller and Auditor General (CAG) of India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138015199198740489",
                "total_points": null,
                "row_num": 230,
                "total_users": 1,
                "org_name": "REGIONAL RURAL BANKS"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360619366100172863",
                "total_points": null,
                "row_num": 231,
                "total_users": 17,
                "org_name": "Prime Minister Office (PMO)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358912553238528043",
                "total_points": null,
                "row_num": 232,
                "total_users": 1,
                "org_name": "SRI BHAJAN EMPPLOYMENT BOOK CENTER"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132593264095559687",
                "total_points": null,
                "row_num": 233,
                "total_users": 13,
                "org_name": "UDEMY"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013787350229024768185",
                "total_points": null,
                "row_num": 234,
                "total_users": 1,
                "org_name": "Department of Justice"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137980951196385286",
                "total_points": null,
                "row_num": 235,
                "total_users": 1,
                "org_name": "Sundarban Affairs Department West Bengal"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138425823431475204",
                "total_points": null,
                "row_num": 236,
                "total_users": 1,
                "org_name": "Insolvency and Bankruptcy Board of India (IBBI)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0133724721041817601",
                "total_points": null,
                "row_num": 237,
                "total_users": 10,
                "org_name": "ICMR"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358336744676556821",
                "total_points": null,
                "row_num": 238,
                "total_users": 2,
                "org_name": "ARUNACHAL PRADESH"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013846004568539136107",
                "total_points": null,
                "row_num": 239,
                "total_users": 3,
                "org_name": "Ministry of Railway"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013871541254152192177",
                "total_points": null,
                "row_num": 240,
                "total_users": 1,
                "org_name": "Central Secretariat Service(CSS) Officers - Annual Performance Appraisal Report (APAR) Monitoring System"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385745633121894491",
                "total_points": null,
                "row_num": 241,
                "total_users": 1,
                "org_name": "Centre for DNA Fingerprinting and Diagnostics (CDFD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360687675989196874",
                "total_points": null,
                "row_num": 242,
                "total_users": 4,
                "org_name": "Department Of Personnel"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379928534342860824",
                "total_points": null,
                "row_num": 243,
                "total_users": 1,
                "org_name": "ACCOUNT MSME"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013620447849873408139",
                "total_points": null,
                "row_num": 244,
                "total_users": 1,
                "org_name": "Legal"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372776953881395244",
                "total_points": null,
                "row_num": 245,
                "total_users": 13,
                "org_name": "Sashastra Seema Bal (SSB)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013644245848031232311",
                "total_points": null,
                "row_num": 246,
                "total_users": 4,
                "org_name": "Post Graduate Institute of Child Health"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385813179805696032",
                "total_points": null,
                "row_num": 247,
                "total_users": 5,
                "org_name": "Department one"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013640725777645568308",
                "total_points": null,
                "row_num": 248,
                "total_users": 2,
                "org_name": "General Administration Department Meghalaya"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044182666444870",
                "total_points": null,
                "row_num": 249,
                "total_users": 1,
                "org_name": "KERALA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384891735923916894",
                "total_points": null,
                "row_num": 250,
                "total_users": 1,
                "org_name": "Chhattisgarh Postal Circle"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135791278113095686",
                "total_points": null,
                "row_num": 251,
                "total_users": 3,
                "org_name": "General Administration Ladakh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384737210671923236",
                "total_points": null,
                "row_num": 252,
                "total_users": 1,
                "org_name": "State Institute of Public Administration and Rural Development (SIPARD)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382408888970444844",
                "total_points": null,
                "row_num": 253,
                "total_users": 3,
                "org_name": "Directorate General of Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013796550145433600201",
                "total_points": null,
                "row_num": 254,
                "total_users": 8,
                "org_name": "Ministry of Labour and Employment"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360764933497651281",
                "total_points": null,
                "row_num": 255,
                "total_users": 1,
                "org_name": "Construction Organisation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360604764241920055",
                "total_points": null,
                "row_num": 256,
                "total_users": 53,
                "org_name": "CBIC CENTRAL BOARD OF INDIRECT TAXES & CUSTOMS"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01355941649063936029",
                "total_points": null,
                "row_num": 257,
                "total_users": 15,
                "org_name": "CBP PORTAL "
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374911668681113626",
                "total_points": null,
                "row_num": 258,
                "total_users": 3,
                "org_name": "Ministry of data"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013614668388343808118",
                "total_points": null,
                "row_num": 259,
                "total_users": 8,
                "org_name": "Ministry of Education"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360972308660224086",
                "total_points": null,
                "row_num": 260,
                "total_users": 77,
                "org_name": "Indo Tibetan Border Police (ITBP)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359044163020390464",
                "total_points": null,
                "row_num": 261,
                "total_users": 17,
                "org_name": "Ministry of Home Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013633098358669312185",
                "total_points": null,
                "row_num": 262,
                "total_users": 3,
                "org_name": "OFFICE OF CHIEF CONTROLLER OF ACCOUNT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138022298289520642",
                "total_points": null,
                "row_num": 263,
                "total_users": 4,
                "org_name": "National Informatics Centre (NIC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866600509988864305",
                "total_points": null,
                "row_num": 264,
                "total_users": 1,
                "org_name": "Electronics and Information Technology Department"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373278785184563265",
                "total_points": null,
                "row_num": 265,
                "total_users": 1,
                "org_name": "Field Operations Division"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135054866668503042",
                "total_points": null,
                "row_num": 266,
                "total_users": 3,
                "org_name": "spv portal dept"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01357983854455193614",
                "total_points": null,
                "row_num": 267,
                "total_users": 8,
                "org_name": "UTTAR PRADESH"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380136685898137653",
                "total_points": null,
                "row_num": 268,
                "total_users": 1,
                "org_name": "Departmental Accounting Organization"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01387437091878502465",
                "total_points": null,
                "row_num": 269,
                "total_users": 1,
                "org_name": "General Administration Department (GAD) Jammu and Kashmir"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373714330840268881",
                "total_points": null,
                "row_num": 270,
                "total_users": 1,
                "org_name": "Testing CBP p"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359467868939878491",
                "total_points": null,
                "row_num": 271,
                "total_users": 2,
                "org_name": "Gulbarga Electricity Supply Company (GESCOM)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374905340651929624",
                "total_points": null,
                "row_num": 272,
                "total_users": 2,
                "org_name": "ODISHA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373837973956198497",
                "total_points": null,
                "row_num": 273,
                "total_users": 3,
                "org_name": "CBP-digital India"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013708840454520832231",
                "total_points": null,
                "row_num": 274,
                "total_users": 1,
                "org_name": "REGIONAL PAY AND ACCOUNTS OFFICE CRPF KOLKATA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374261146930380810",
                "total_points": null,
                "row_num": 275,
                "total_users": 1,
                "org_name": "Marine Products Export Development Authority (MPEDA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134892390443581443",
                "total_points": null,
                "row_num": 276,
                "total_users": 3,
                "org_name": "testcbp"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358833364554547230",
                "total_points": null,
                "row_num": 277,
                "total_users": 1,
                "org_name": "International Centre for Alternative Dispute Resolution (ICADR)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382495799051878496",
                "total_points": null,
                "row_num": 278,
                "total_users": 1,
                "org_name": "Commissionerate of Labour Labour & Employment Department Government of Gujarat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376824514990080075",
                "total_points": null,
                "row_num": 279,
                "total_users": 2,
                "org_name": "criminal law"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358912293839667241",
                "total_points": null,
                "row_num": 280,
                "total_users": 1,
                "org_name": "UTTARAKHAND"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013704327184826368217",
                "total_points": null,
                "row_num": 281,
                "total_users": 3,
                "org_name": "Indian Air Force"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137987402065346563",
                "total_points": null,
                "row_num": 282,
                "total_users": 1,
                "org_name": "INDIA POST PAYMENT BANK Limited"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137449351019724806",
                "total_points": null,
                "row_num": 283,
                "total_users": 1,
                "org_name": "kerala state"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013797398677397504229",
                "total_points": null,
                "row_num": 284,
                "total_users": 1,
                "org_name": "Directorate General of Lighthouses and Lightships"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013842418804776960360",
                "total_points": null,
                "row_num": 285,
                "total_users": 2,
                "org_name": "Testing Ministry"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013688248592531456170",
                "total_points": null,
                "row_num": 286,
                "total_users": 1,
                "org_name": "West Bengal Postal Circle"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379298447061811241",
                "total_points": null,
                "row_num": 287,
                "total_users": 3,
                "org_name": "Ministry of Water Resources River Development and Ganga Rejuvenation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013787321083092992181",
                "total_points": null,
                "row_num": 288,
                "total_users": 12,
                "org_name": "Indian Bureau of Mines"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01383232892665856074",
                "total_points": null,
                "row_num": 289,
                "total_users": 1,
                "org_name": "Recruitment Rules Formulation Amendment and Monitoring System Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134425930254827520",
                "total_points": null,
                "row_num": 290,
                "total_users": 5,
                "org_name": "Indian Institute of Public Administration"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385881088909312069",
                "total_points": null,
                "row_num": 291,
                "total_users": 1,
                "org_name": "Karnataka State Pharmacy Council (KSPC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374897031639859217",
                "total_points": null,
                "row_num": 292,
                "total_users": 2,
                "org_name": "Central Power Research Institute (CPRI) Bangalore Karnataka"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01367269191414579250",
                "total_points": null,
                "row_num": 293,
                "total_users": 1,
                "org_name": "Jammu and Kashmir Police"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385882883198976073",
                "total_points": null,
                "row_num": 294,
                "total_users": 1,
                "org_name": "Uttar Pradesh Police"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01373833896865792095",
                "total_points": null,
                "row_num": 295,
                "total_users": 5,
                "org_name": "Apex Bodies"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384825888804864076",
                "total_points": null,
                "row_num": 296,
                "total_users": 2,
                "org_name": "Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013857947568422912106",
                "total_points": null,
                "row_num": 297,
                "total_users": 2,
                "org_name": "Parliamentary Affairs Department Mantralaya"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013621026964987904143",
                "total_points": null,
                "row_num": 298,
                "total_users": 1,
                "org_name": "Center of Biomedical Magnetic Resonance Lucknow"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01388705627652915213",
                "total_points": null,
                "row_num": 299,
                "total_users": 1,
                "org_name": "Kendriya Sainik Board Secretariat (KSB) Ministry of Defence"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838837971042304248",
                "total_points": null,
                "row_num": 300,
                "total_users": 1,
                "org_name": "Department of Food and Public Distribution"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01367766432250265661",
                "total_points": null,
                "row_num": 301,
                "total_users": 1,
                "org_name": "TELANGANA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013833406554652672103",
                "total_points": null,
                "row_num": 302,
                "total_users": 1,
                "org_name": "National Industrial Corridor Development Corporation Limited"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01381850232002150410",
                "total_points": null,
                "row_num": 303,
                "total_users": 1,
                "org_name": "Department of Scientific and Industrial Research (DSIR)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013826788802347008169",
                "total_points": null,
                "row_num": 304,
                "total_users": 1,
                "org_name": "Dena bank"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132622588908339201",
                "total_points": null,
                "row_num": 305,
                "total_users": 9,
                "org_name": "STQC"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013787458017320960194",
                "total_points": null,
                "row_num": 306,
                "total_users": 5,
                "org_name": "Geological Survey of India (GSI)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385145650103091267",
                "total_points": null,
                "row_num": 307,
                "total_users": 1,
                "org_name": "Central Railway"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01383124306335334452",
                "total_points": null,
                "row_num": 308,
                "total_users": 1,
                "org_name": "Circular Management Information System"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013623888315121664147",
                "total_points": null,
                "row_num": 309,
                "total_users": 45,
                "org_name": "Border Security Force (BSF)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01382199056048128031",
                "total_points": null,
                "row_num": 310,
                "total_users": 3,
                "org_name": "Rajya Sabha Secretariat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013614665778569216116",
                "total_points": null,
                "row_num": 311,
                "total_users": 1,
                "org_name": "Bodoland Administrative Staff College"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013693149388513280187",
                "total_points": null,
                "row_num": 312,
                "total_users": 2,
                "org_name": "National Authority for Chemical Weapons Convention (NACWC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838893186351104258",
                "total_points": null,
                "row_num": 313,
                "total_users": 1,
                "org_name": "Raghib CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01381671627150131224",
                "total_points": null,
                "row_num": 314,
                "total_users": 1,
                "org_name": "Department of Science and Technology (DST)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01381906916850892825",
                "total_points": null,
                "row_num": 315,
                "total_users": 2,
                "org_name": "Ministry of Finance"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013704495984009216223",
                "total_points": null,
                "row_num": 316,
                "total_users": 15,
                "org_name": "Controller General of Defence Accounts"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137900357480038404",
                "total_points": null,
                "row_num": 317,
                "total_users": 9,
                "org_name": "Central Reserve Police Force (CRPF)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013710081026138112237",
                "total_points": null,
                "row_num": 318,
                "total_users": 4,
                "org_name": "Ministry of Defence"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137450259945390088",
                "total_points": null,
                "row_num": 319,
                "total_users": 1,
                "org_name": "Indian Institute of Tecnhnology"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384384494908211246",
                "total_points": null,
                "row_num": 320,
                "total_users": 1,
                "org_name": "Central Staffing Scheme Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385304990398873613",
                "total_points": null,
                "row_num": 321,
                "total_users": 2,
                "org_name": "Department of Financial Services"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01381901507081830417",
                "total_points": null,
                "row_num": 322,
                "total_users": 4,
                "org_name": "National Rural Livelihoods Mission (NRLM) - Aajeevika"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360602496242483252",
                "total_points": null,
                "row_num": 323,
                "total_users": 1,
                "org_name": "National Academy of Indian Railways"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0132593323141201929",
                "total_points": null,
                "row_num": 324,
                "total_users": 14,
                "org_name": "DOPI"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385076907907481615",
                "total_points": null,
                "row_num": 325,
                "total_users": 9,
                "org_name": "Employees State Insurance Corporation (ESIC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01367546072115609633",
                "total_points": null,
                "row_num": 326,
                "total_users": 3,
                "org_name": "National Judicial Academy Bhopal"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866588369567744294",
                "total_points": null,
                "row_num": 327,
                "total_users": 9,
                "org_name": "ravicbp"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138827731090554883",
                "total_points": null,
                "row_num": 328,
                "total_users": 1,
                "org_name": "Fisheries Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379300286193664044",
                "total_points": null,
                "row_num": 329,
                "total_users": 2,
                "org_name": "Department of Consumer Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0136507096703139844",
                "total_points": null,
                "row_num": 330,
                "total_users": 1,
                "org_name": "Civil Construction Wing All India Radio"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374269161131212813",
                "total_points": null,
                "row_num": 331,
                "total_users": 1,
                "org_name": "Special Protection Group (SPG)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138015153857495047",
                "total_points": null,
                "row_num": 332,
                "total_users": 1,
                "org_name": "BANKING SECTOR"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358911309859225639",
                "total_points": null,
                "row_num": 333,
                "total_users": 1,
                "org_name": "CE RO Office MoRTH Bengaluru"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376743249867571249",
                "total_points": null,
                "row_num": 334,
                "total_users": 2,
                "org_name": "Autonomous Body"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013709384341602304233",
                "total_points": null,
                "row_num": 335,
                "total_users": 1,
                "org_name": "Office of Deputy Director General Sikkim DoT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359468760251596894",
                "total_points": null,
                "row_num": 336,
                "total_users": 5,
                "org_name": "Advisor Office"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366259031639654410",
                "total_points": null,
                "row_num": 337,
                "total_users": 1,
                "org_name": "NTPC limited-SRHQ sadan region headquarter"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01384392945143808064",
                "total_points": null,
                "row_num": 338,
                "total_users": 2,
                "org_name": "Ministry of Sports"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135791263737364484",
                "total_points": null,
                "row_num": 339,
                "total_users": 1,
                "org_name": "Indraprastha Power Generation Co. Ltd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366554007915724816",
                "total_points": null,
                "row_num": 340,
                "total_users": 31,
                "org_name": "Controllers of Communication Accounts Department of Telecom"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137199859655229442",
                "total_points": null,
                "row_num": 341,
                "total_users": 1,
                "org_name": "PAG ERSA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013840211303628800286",
                "total_points": null,
                "row_num": 342,
                "total_users": 1,
                "org_name": "Central Armed Police Forces"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359342801614438486",
                "total_points": null,
                "row_num": 343,
                "total_users": 2,
                "org_name": "Project Progress Monitoring System"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358914521880166446",
                "total_points": null,
                "row_num": 344,
                "total_users": 1,
                "org_name": "Block Development Officer"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139998612105216007",
                "total_points": null,
                "row_num": 345,
                "total_users": 4,
                "org_name": "DRDO"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135954357612625920",
                "total_points": null,
                "row_num": 346,
                "total_users": 2,
                "org_name": "NTPC Tamilnadu Energy Company Ltd"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135071359030722569",
                "total_points": null,
                "row_num": 347,
                "total_users": 203,
                "org_name": "Karmayogi Bharat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358340065167769623",
                "total_points": null,
                "row_num": 348,
                "total_users": 1,
                "org_name": "JPAL New"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013738410017947648102",
                "total_points": null,
                "row_num": 349,
                "total_users": 4,
                "org_name": "MAHARASHTRA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013872898519187456276",
                "total_points": null,
                "row_num": 350,
                "total_users": 1,
                "org_name": "Election Department Delhi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013837440604364800177",
                "total_points": null,
                "row_num": 351,
                "total_users": 2,
                "org_name": "Tel1"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135806574152417284",
                "total_points": null,
                "row_num": 352,
                "total_users": 1,
                "org_name": "NTPC-SMTPS"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358133618012160016",
                "total_points": null,
                "row_num": 353,
                "total_users": 4,
                "org_name": "Cattle and Dairy Development Division Department"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366832637070540821",
                "total_points": null,
                "row_num": 354,
                "total_users": 1,
                "org_name": "DISTRICT COURT RUDRAPRAYAG"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013826229980823552144",
                "total_points": null,
                "row_num": 355,
                "total_users": 2,
                "org_name": "Press Information Bureau (PIB)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01389120321445068833",
                "total_points": null,
                "row_num": 356,
                "total_users": 1,
                "org_name": "North Western Railway"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01387364496885350432",
                "total_points": null,
                "row_num": 357,
                "total_users": 1,
                "org_name": "Board of Revenue Government of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01366840048450764834",
                "total_points": null,
                "row_num": 358,
                "total_users": 1,
                "org_name": "ALL INDIA RADIO KADAPA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013842343116251136339",
                "total_points": null,
                "row_num": 359,
                "total_users": 2,
                "org_name": "Directorate General of Quality Assurance ( DGQA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013838891397005312256",
                "total_points": null,
                "row_num": 360,
                "total_users": 7,
                "org_name": "Mahesh CBP"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0134900214601072649",
                "total_points": null,
                "row_num": 361,
                "total_users": 2,
                "org_name": "testmdoa"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013422126569889792745",
                "total_points": null,
                "row_num": 362,
                "total_users": 1,
                "org_name": "JPALtest 1"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372729081852723241",
                "total_points": null,
                "row_num": 363,
                "total_users": 178,
                "org_name": "Bharat Sanchar Nigam Limited Portal(BSNL)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013796238381080576176",
                "total_points": null,
                "row_num": 364,
                "total_users": 6,
                "org_name": "Ministry of External Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137987395462348800",
                "total_points": null,
                "row_num": 365,
                "total_users": 1,
                "org_name": "Bangalore Metro Rail Corporation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0139543696241049600",
                "total_points": null,
                "row_num": 366,
                "total_users": 2,
                "org_name": "UI Development Ministry"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013688770184970240172",
                "total_points": null,
                "row_num": 367,
                "total_users": 1,
                "org_name": "HCSL"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380153375398297612",
                "total_points": null,
                "row_num": 368,
                "total_users": 1,
                "org_name": "Institute of Secretariat Training and Management (ISTM)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013872038299779072190",
                "total_points": null,
                "row_num": 369,
                "total_users": 1,
                "org_name": "Ministry of Minority Affairs"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358981243515699250",
                "total_points": null,
                "row_num": 370,
                "total_users": 2,
                "org_name": "BIHAR"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013738420634615808105",
                "total_points": null,
                "row_num": 371,
                "total_users": 1,
                "org_name": "BHAKRA BEAS MANAGEMENT BOARD"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01357853124168089610",
                "total_points": null,
                "row_num": 372,
                "total_users": 3,
                "org_name": "Kiru HEP CVPPPL"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0137979945707847684",
                "total_points": null,
                "row_num": 373,
                "total_users": 1,
                "org_name": "Licensing Finance Assessment"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013876369380597760119",
                "total_points": null,
                "row_num": 374,
                "total_users": 1,
                "org_name": "Ministry of Women and Child Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358993635114188855",
                "total_points": null,
                "row_num": 375,
                "total_users": 6,
                "org_name": "KARNATAKA"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01376168567812915238",
                "total_points": null,
                "row_num": 376,
                "total_users": 4,
                "org_name": "Assam Rifles"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135806517433139202",
                "total_points": null,
                "row_num": 377,
                "total_users": 2,
                "org_name": "NTPC LTD"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379928317504716825",
                "total_points": null,
                "row_num": 378,
                "total_users": 1,
                "org_name": "Ministry of Micro Small and Medium Enterprises"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0135806667844157448",
                "total_points": null,
                "row_num": 379,
                "total_users": 1,
                "org_name": "Home Coordination cell"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138141945081774083",
                "total_points": null,
                "row_num": 380,
                "total_users": 1,
                "org_name": "Hindustan Aeronautics Limited (HAL)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0141255393750466568",
                "total_points": null,
                "row_num": 381,
                "total_users": 1,
                "org_name": "TarentoDepartment"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013875804045262848103",
                "total_points": null,
                "row_num": 382,
                "total_users": 1,
                "org_name": "Lal Bahadur Shastri National Academy of Administration (LBSNAA)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013811399621681152122",
                "total_points": null,
                "row_num": 383,
                "total_users": 2,
                "org_name": "Mumbai Port Trust"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013846128791756800122",
                "total_points": null,
                "row_num": 384,
                "total_users": 1,
                "org_name": "Central Police Organisation"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013704368151273472219",
                "total_points": null,
                "row_num": 385,
                "total_users": 2,
                "org_name": "South Campus Library"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013682563489357824113",
                "total_points": null,
                "row_num": 386,
                "total_users": 2,
                "org_name": "DG Armed Forces Medical Service"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01372421552310681621",
                "total_points": null,
                "row_num": 387,
                "total_users": 1,
                "org_name": "Lok Sabha Secretariat"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138185088774881289",
                "total_points": null,
                "row_num": 388,
                "total_users": 2,
                "org_name": "CSIR Central Institute of Mining Fuel Research"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01374897086915379215",
                "total_points": null,
                "row_num": 389,
                "total_users": 6,
                "org_name": "Northern Regional Power Committee Ministry of Power"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01379306160361472052",
                "total_points": null,
                "row_num": 390,
                "total_users": 1,
                "org_name": "Karnataka state"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385115674601881660",
                "total_points": null,
                "row_num": 391,
                "total_users": 1,
                "org_name": "Department of Defence Research & Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01359132123730739281",
                "total_points": null,
                "row_num": 392,
                "total_users": 5,
                "org_name": "Ministry of Power"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013645046371606528327",
                "total_points": null,
                "row_num": 393,
                "total_users": 1,
                "org_name": "National Test House"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013837481425641472188",
                "total_points": null,
                "row_num": 394,
                "total_users": 6,
                "org_name": "Telaagana Ministry"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01354667993206784045",
                "total_points": null,
                "row_num": 395,
                "total_users": 1,
                "org_name": "igotTes"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013826300235235328155",
                "total_points": null,
                "row_num": 396,
                "total_users": 1,
                "org_name": "Oo Deputy Director General Sikkim WB LSA DoT Ga"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013634309638332416187",
                "total_points": null,
                "row_num": 397,
                "total_users": 1,
                "org_name": "Organisation of IGOT"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013827565830537216583",
                "total_points": null,
                "row_num": 398,
                "total_users": 3,
                "org_name": "Indian Coast Guard"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01385813977602457634",
                "total_points": null,
                "row_num": 399,
                "total_users": 5,
                "org_name": "Department two"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866570357047296290",
                "total_points": null,
                "row_num": 400,
                "total_users": 1,
                "org_name": "Minister for New Delhi"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013870800352509952165",
                "total_points": null,
                "row_num": 401,
                "total_users": 1,
                "org_name": "Ministry of Urban Development"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013866623533744128310",
                "total_points": null,
                "row_num": 402,
                "total_users": 3,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "0138034834265128961",
                "total_points": null,
                "row_num": 403,
                "total_users": 1,
                "org_name": "Mahanagar telephone nigam limited(MTNL)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013422066455224320742",
                "total_points": null,
                "row_num": 404,
                "total_users": 1,
                "org_name": "commercetestedited"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01380172700939059233",
                "total_points": null,
                "row_num": 405,
                "total_users": 1,
                "org_name": "Abcdee"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "013712276713988096240",
                "total_points": null,
                "row_num": 406,
                "total_users": 6,
                "org_name": "Central Board of Excise and Customs (CBEC)"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01360689582162739276",
                "total_points": null,
                "row_num": 407,
                "total_users": 3,
                "org_name": "Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "S",
                "last_credit_date": null,
                "org_id": "01358632512033587228",
                "total_points": null,
                "row_num": 408,
                "total_users": 2,
                "org_name": "Delhi District Courts"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-25 11:20:00+0530",
                "org_id": "0132238763297177601",
                "total_points": 153,
                "row_num": 1,
                "total_users": 825,
                "org_name": "igot"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-07-01 18:27:40+0530",
                "org_id": "0140788510336040962",
                "total_points": 118,
                "row_num": 2,
                "total_users": 48,
                "org_name": "Finance And Budget"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-24 15:59:59+0530",
                "org_id": "0135071359030722569",
                "total_points": 24,
                "row_num": 3,
                "total_users": 203,
                "org_name": "Karmayogi Bharat"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-14 12:39:26+0530",
                "org_id": "01376822290813747263",
                "total_points": 22,
                "row_num": 4,
                "total_users": 436,
                "org_name": "TarentoCBP"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-26 11:09:09+0530",
                "org_id": "01372729081852723241",
                "total_points": 12,
                "row_num": 5,
                "total_users": 178,
                "org_name": "Bharat Sanchar Nigam Limited Portal(BSNL)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-26 15:58:26+0530",
                "org_id": "01379305664500531251",
                "total_points": 12,
                "row_num": 6,
                "total_users": 634,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-20 01:05:02+0530",
                "org_id": "0132593267437813768",
                "total_points": 10,
                "row_num": 7,
                "total_users": 1070,
                "org_name": "JPAL"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": "2024-06-12 21:40:19+0530",
                "org_id": "01390354700029132834",
                "total_points": 2,
                "row_num": 8,
                "total_users": 11,
                "org_name": "Agrinnovate India"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01353676035393126415",
                "total_points": null,
                "row_num": 9,
                "total_users": 9,
                "org_name": "Open Source Tech Dev CBP Provider"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01379847820362547216",
                "total_points": null,
                "row_num": 10,
                "total_users": 22,
                "org_name": "Office of the Registrar General and Census Commissioner Census of India"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01379229387156684826",
                "total_points": null,
                "row_num": 11,
                "total_users": 17,
                "org_name": "Defence Research and Development Organisation (DRDO)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01326127402578739228",
                "total_points": null,
                "row_num": 12,
                "total_users": 8,
                "org_name": "Ministry of Networks"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013827571756179456586",
                "total_points": null,
                "row_num": 13,
                "total_users": 924,
                "org_name": "test bulk upload"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013838890322845696254",
                "total_points": null,
                "row_num": 14,
                "total_users": 9,
                "org_name": "Deepak CBP"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013417727046164480667",
                "total_points": null,
                "row_num": 15,
                "total_users": 14,
                "org_name": "NACIN National Academy of Customs Indirect Taxes and Narcotics"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01376822910112563268",
                "total_points": null,
                "row_num": 16,
                "total_users": 210,
                "org_name": "TarentoMDO"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0132593133014138882",
                "total_points": null,
                "row_num": 17,
                "total_users": 14,
                "org_name": "LABSANA"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013694419603603456193",
                "total_points": null,
                "row_num": 18,
                "total_users": 8,
                "org_name": "Ministry of Communications"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01353949615398092815",
                "total_points": null,
                "row_num": 19,
                "total_users": 10,
                "org_name": "Igot CBP Provider"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01379929322870374431",
                "total_points": null,
                "row_num": 20,
                "total_users": 18,
                "org_name": "Employees Provident Fund Organisation (EPFO)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01376187695259648041",
                "total_points": null,
                "row_num": 21,
                "total_users": 11,
                "org_name": "Indian Council of Medical Research (ICMR)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01359045143774822474",
                "total_points": null,
                "row_num": 22,
                "total_users": 10,
                "org_name": "AAICLAS"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013690250168123392178",
                "total_points": null,
                "row_num": 23,
                "total_users": 37,
                "org_name": "Border Road Organisation"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013703646888394752207",
                "total_points": null,
                "row_num": 24,
                "total_users": 32,
                "org_name": "Food Corporation of India (FCI)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01344766896078848010",
                "total_points": null,
                "row_num": 25,
                "total_users": 65,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013417772493185024682",
                "total_points": null,
                "row_num": 26,
                "total_users": 59,
                "org_name": "NIRDPR National Institute of Rural Development and Panchayati Raj"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01384674984551219213",
                "total_points": null,
                "row_num": 27,
                "total_users": 368,
                "org_name": "Mahesh MDO"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0134157287914864641",
                "total_points": null,
                "row_num": 28,
                "total_users": 30,
                "org_name": "CBI Academy"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01384675536621568015",
                "total_points": null,
                "row_num": 29,
                "total_users": 88,
                "org_name": "Shankar MDO"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0135962841564774408",
                "total_points": null,
                "row_num": 30,
                "total_users": 24,
                "org_name": "Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01344770342046924817",
                "total_points": null,
                "row_num": 31,
                "total_users": 16,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01354383440999219234",
                "total_points": null,
                "row_num": 32,
                "total_users": 21,
                "org_name": "SundarCBP"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013793584981893120116",
                "total_points": null,
                "row_num": 33,
                "total_users": 82,
                "org_name": "Employees State Insurance Corporation"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0134156658793594880",
                "total_points": null,
                "row_num": 34,
                "total_users": 677,
                "org_name": "Department of Telecommunications DOT"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0138043201608089602",
                "total_points": null,
                "row_num": 35,
                "total_users": 48,
                "org_name": "RKCbp"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01359693287062732810",
                "total_points": null,
                "row_num": 36,
                "total_users": 13,
                "org_name": "Department Of Posts"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01360619366100172863",
                "total_points": null,
                "row_num": 37,
                "total_users": 17,
                "org_name": "Prime Minister Office (PMO)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0132593264095559687",
                "total_points": null,
                "row_num": 38,
                "total_users": 13,
                "org_name": "UDEMY"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0133724721041817601",
                "total_points": null,
                "row_num": 39,
                "total_users": 10,
                "org_name": "ICMR"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01372776953881395244",
                "total_points": null,
                "row_num": 40,
                "total_users": 13,
                "org_name": "Sashastra Seema Bal (SSB)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013796550145433600201",
                "total_points": null,
                "row_num": 41,
                "total_users": 8,
                "org_name": "Ministry of Labour and Employment"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01360604764241920055",
                "total_points": null,
                "row_num": 42,
                "total_users": 53,
                "org_name": "CBIC CENTRAL BOARD OF INDIRECT TAXES & CUSTOMS"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01355941649063936029",
                "total_points": null,
                "row_num": 43,
                "total_users": 15,
                "org_name": "CBP PORTAL "
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01360972308660224086",
                "total_points": null,
                "row_num": 44,
                "total_users": 77,
                "org_name": "Indo Tibetan Border Police (ITBP)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013614668388343808118",
                "total_points": null,
                "row_num": 45,
                "total_users": 8,
                "org_name": "Ministry of Education"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01359044163020390464",
                "total_points": null,
                "row_num": 46,
                "total_users": 17,
                "org_name": "Ministry of Home Affairs"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01357983854455193614",
                "total_points": null,
                "row_num": 47,
                "total_users": 8,
                "org_name": "UTTAR PRADESH"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013787321083092992181",
                "total_points": null,
                "row_num": 48,
                "total_users": 12,
                "org_name": "Indian Bureau of Mines"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0132622588908339201",
                "total_points": null,
                "row_num": 49,
                "total_users": 9,
                "org_name": "STQC"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013623888315121664147",
                "total_points": null,
                "row_num": 50,
                "total_users": 45,
                "org_name": "Border Security Force (BSF)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013704495984009216223",
                "total_points": null,
                "row_num": 51,
                "total_users": 15,
                "org_name": "Controller General of Defence Accounts"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0137900357480038404",
                "total_points": null,
                "row_num": 52,
                "total_users": 9,
                "org_name": "Central Reserve Police Force (CRPF)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "0132593323141201929",
                "total_points": null,
                "row_num": 53,
                "total_users": 14,
                "org_name": "DOPI"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01385076907907481615",
                "total_points": null,
                "row_num": 54,
                "total_users": 9,
                "org_name": "Employees State Insurance Corporation (ESIC)"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "013866588369567744294",
                "total_points": null,
                "row_num": 55,
                "total_users": 9,
                "org_name": "ravicbp"
            },
            {
                "is_state": true,
                "size": "XL",
                "last_credit_date": null,
                "org_id": "01366554007915724816",
                "total_points": null,
                "row_num": 56,
                "total_users": 32,
                "org_name": "Controllers of Communication Accounts Department of Telecom"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142133128812953601",
                "total_points": 10,
                "row_num": 1,
                "total_users": 64,
                "org_name": "UTTAR PRADESH"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142679329089208321",
                "total_points": 5,
                "row_num": 2,
                "total_users": 62,
                "org_name": "kerala state"
            },
            {
                "is_state": false,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "null",
                "total_points": 0,
                "row_num": 3,
                "total_users": 83,
                "org_name": "test"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": "2024-10-21 15:22:43+0530",
                "org_id": "01376824060923904074",
                "total_points": 5,
                "row_num": 4,
                "total_users": 1,
                "org_name": "igot1"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358566344037990426",
                "total_points": null,
                "row_num": 5,
                "total_users": 4,
                "org_name": "Income Tax Appellate Tribunal (ITAT) Jaipur"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358834824804761632",
                "total_points": null,
                "row_num": 6,
                "total_users": 1,
                "org_name": "COMMON SERVICE CENTER"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135790980132372480",
                "total_points": null,
                "row_num": 7,
                "total_users": 5,
                "org_name": "OFFICE OF THE PROTECTOR OF EMIGRANTS VIDESH BHAVAN"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013635016947286016192",
                "total_points": null,
                "row_num": 8,
                "total_users": 5,
                "org_name": "Ministry of Agriculture and Farmers Welfare"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01387565009760256087",
                "total_points": null,
                "row_num": 9,
                "total_users": 1,
                "org_name": "Government Polytechnic Ratnagiri"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359911567899033615",
                "total_points": null,
                "row_num": 10,
                "total_users": 5,
                "org_name": "Department of Economic Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01353676035393126415",
                "total_points": null,
                "row_num": 11,
                "total_users": 9,
                "org_name": "Open Source Tech Dev CBP Provider"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137442086132203521",
                "total_points": null,
                "row_num": 12,
                "total_users": 1,
                "org_name": "BAY OF BENGAL"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866575265136640289",
                "total_points": null,
                "row_num": 13,
                "total_users": 1,
                "org_name": "Testing New Delhi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385305747483033618",
                "total_points": null,
                "row_num": 14,
                "total_users": 1,
                "org_name": "Water Resources Department Maharashtra"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376238589099212843",
                "total_points": null,
                "row_num": 15,
                "total_users": 1,
                "org_name": "National Skill Training Institute for Women"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137921146925056009",
                "total_points": null,
                "row_num": 16,
                "total_users": 1,
                "org_name": "National Council for Hotel Management and Catering Technology (NCHMCT)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139260708968529920",
                "total_points": null,
                "row_num": 17,
                "total_users": 3,
                "org_name": "Gramener"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135785230328381448",
                "total_points": null,
                "row_num": 18,
                "total_users": 6,
                "org_name": "POWERGRID CORPORATION OF INDIA LIMITED"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01367545353202892831",
                "total_points": null,
                "row_num": 19,
                "total_users": 1,
                "org_name": "Metropolitan Magistrates Court"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01354015307459788827",
                "total_points": null,
                "row_num": 20,
                "total_users": 2,
                "org_name": "Test MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385101666774220845",
                "total_points": null,
                "row_num": 21,
                "total_users": 1,
                "org_name": "Presidents Secretariat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139470122340352009",
                "total_points": null,
                "row_num": 22,
                "total_users": 1,
                "org_name": "Central Railside Warehouse Company Ltd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140801732728668160",
                "total_points": null,
                "row_num": 23,
                "total_users": 1,
                "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379847820362547216",
                "total_points": null,
                "row_num": 24,
                "total_users": 21,
                "org_name": "Office of the Registrar General and Census Commissioner Census of India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866596325040128300",
                "total_points": null,
                "row_num": 25,
                "total_users": 2,
                "org_name": "cbp testing CC CR CP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384396684571443276",
                "total_points": null,
                "row_num": 26,
                "total_users": 1,
                "org_name": "Ministry of Information and Technology"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01377820590049689621",
                "total_points": null,
                "row_num": 27,
                "total_users": 1,
                "org_name": "BIHAR LEGISLATIVE COUNCIL"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013793625915031552122",
                "total_points": null,
                "row_num": 28,
                "total_users": 1,
                "org_name": "Electronic Media Monitoring Center (EMMC) Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379229387156684826",
                "total_points": null,
                "row_num": 29,
                "total_users": 17,
                "org_name": "Defence Research and Development Organisation (DRDO)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379311867052032072",
                "total_points": null,
                "row_num": 30,
                "total_users": 1,
                "org_name": "Sampledeptkata"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140788510336040962",
                "total_points": null,
                "row_num": 31,
                "total_users": 46,
                "org_name": "Finance and Budget testing"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01417029850189004834",
                "total_points": null,
                "row_num": 32,
                "total_users": 1,
                "org_name": "Organisation of Gale Rowe"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385255992637849611",
                "total_points": null,
                "row_num": 33,
                "total_users": 1,
                "org_name": "Panchayat Raj and Rural Development Department Telangana"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013635898769596416219",
                "total_points": null,
                "row_num": 34,
                "total_users": 1,
                "org_name": "Performance Management Division (PMD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01326127402578739228",
                "total_points": null,
                "row_num": 35,
                "total_users": 8,
                "org_name": "Ministry of Networks"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141185267421347840",
                "total_points": null,
                "row_num": 36,
                "total_users": 2,
                "org_name": "Mahesh MDO GCP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013873027489333248314",
                "total_points": null,
                "row_num": 37,
                "total_users": 1,
                "org_name": "Kerala House"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132245461338112000",
                "total_points": null,
                "row_num": 38,
                "total_users": 2,
                "org_name": "karmayogi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01390203930746880027",
                "total_points": null,
                "row_num": 39,
                "total_users": 4,
                "org_name": "University Grants Commission  "
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141878422408478720",
                "total_points": null,
                "row_num": 40,
                "total_users": 4,
                "org_name": "Capacity Building Commission"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01325419073593344035",
                "total_points": null,
                "row_num": 41,
                "total_users": 1,
                "org_name": null
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380495595397120010",
                "total_points": null,
                "row_num": 42,
                "total_users": 3,
                "org_name": "Ministry of Shipping"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374684479621529610",
                "total_points": null,
                "row_num": 43,
                "total_users": 2,
                "org_name": "National informatic center"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359823173205196811",
                "total_points": null,
                "row_num": 44,
                "total_users": 2,
                "org_name": "Rafi Ahmed Kidwai National Postal Academy (RAKNPA) Ghaziabad Uttarpradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838893368139776252",
                "total_points": null,
                "row_num": 45,
                "total_users": 3,
                "org_name": "Radhesh CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01386730483877478413",
                "total_points": null,
                "row_num": 46,
                "total_users": 2,
                "org_name": "QATestingKB"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384742629584896049",
                "total_points": null,
                "row_num": 47,
                "total_users": 1,
                "org_name": "ATI KARNATAKA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384741330363187245",
                "total_points": null,
                "row_num": 48,
                "total_users": 1,
                "org_name": "Ecommittee Supreme Court of India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379920039446118410",
                "total_points": null,
                "row_num": 49,
                "total_users": 1,
                "org_name": "Bureau of Police Research & Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01354015402707353625",
                "total_points": null,
                "row_num": 50,
                "total_users": 1,
                "org_name": "Test CBP Provider"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838890322845696254",
                "total_points": null,
                "row_num": 51,
                "total_users": 9,
                "org_name": "Deepak CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013417727046164480667",
                "total_points": null,
                "row_num": 52,
                "total_users": 14,
                "org_name": "NACIN National Academy of Customs Indirect Taxes and Narcotics"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013826786604965888167",
                "total_points": null,
                "row_num": 53,
                "total_users": 2,
                "org_name": "Karnataka state New"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358337021011558422",
                "total_points": null,
                "row_num": 54,
                "total_users": 4,
                "org_name": "GOA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379306818103705656",
                "total_points": null,
                "row_num": 55,
                "total_users": 2,
                "org_name": "Sikkim state"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013797206673039360219",
                "total_points": null,
                "row_num": 56,
                "total_users": 2,
                "org_name": "Ministry of Tourism"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382344192448102415",
                "total_points": null,
                "row_num": 57,
                "total_users": 1,
                "org_name": "Department of Industrial Policy and Promotion"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013846225261092864126",
                "total_points": null,
                "row_num": 58,
                "total_users": 1,
                "org_name": "Ministry of finance once"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013614657438236672114",
                "total_points": null,
                "row_num": 59,
                "total_users": 1,
                "org_name": "Deputy Commissioner Office Kokrajhar"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132592991964119040",
                "total_points": null,
                "row_num": 60,
                "total_users": 6,
                "org_name": "Coursetest"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376822910112563268",
                "total_points": null,
                "row_num": 61,
                "total_users": 206,
                "org_name": "TarentoMDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132593133014138882",
                "total_points": null,
                "row_num": 62,
                "total_users": 14,
                "org_name": "LABSANA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134892964190453767",
                "total_points": null,
                "row_num": 63,
                "total_users": 1,
                "org_name": "myorgseven"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134892251385774080",
                "total_points": null,
                "row_num": 64,
                "total_users": 1,
                "org_name": "testmdo"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013840212060848128285",
                "total_points": null,
                "row_num": 65,
                "total_users": 3,
                "org_name": "Central Industrial Security Force (CISF)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013594797502660608102",
                "total_points": null,
                "row_num": 66,
                "total_users": 4,
                "org_name": "Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01361099925757132897",
                "total_points": null,
                "row_num": 67,
                "total_users": 2,
                "org_name": "PWRMDC Ltd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013694419603603456193",
                "total_points": null,
                "row_num": 68,
                "total_users": 8,
                "org_name": "Ministry of Communications"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013797308466028544225",
                "total_points": null,
                "row_num": 69,
                "total_users": 1,
                "org_name": "National Career Service Center For Differently Abl"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366549425179852814",
                "total_points": null,
                "row_num": 70,
                "total_users": 4,
                "org_name": "Allahabad Nagar Nigam"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013783781194629120122",
                "total_points": null,
                "row_num": 71,
                "total_users": 2,
                "org_name": "MoD Sectt"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044133256396862",
                "total_points": null,
                "row_num": 72,
                "total_users": 1,
                "org_name": "CBFC"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142474691361587206",
                "total_points": null,
                "row_num": 73,
                "total_users": 1,
                "org_name": "dSASDA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385812209356800030",
                "total_points": null,
                "row_num": 74,
                "total_users": 2,
                "org_name": "Information Technology and Electronics Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01353949615398092815",
                "total_points": null,
                "row_num": 75,
                "total_users": 10,
                "org_name": "Igot CBP Provider"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379929322870374431",
                "total_points": null,
                "row_num": 76,
                "total_users": 18,
                "org_name": "Employees Provident Fund Organisation (EPFO)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01417101626080460841",
                "total_points": null,
                "row_num": 77,
                "total_users": 1,
                "org_name": "Organisation of Quentin Mayer"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140788863598264326",
                "total_points": null,
                "row_num": 78,
                "total_users": 10,
                "org_name": "Tarento CBP Provider"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379920524722995212",
                "total_points": null,
                "row_num": 79,
                "total_users": 3,
                "org_name": "Southern Railway"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372712784031744032",
                "total_points": null,
                "row_num": 80,
                "total_users": 2,
                "org_name": "Office of the Commissioner"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141646311855226882",
                "total_points": null,
                "row_num": 81,
                "total_users": 1,
                "org_name": "Organisation of Chase Wintheiser"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358917379604480048",
                "total_points": null,
                "row_num": 82,
                "total_users": 1,
                "org_name": "Ministry of Culture"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013638046465564672269",
                "total_points": null,
                "row_num": 83,
                "total_users": 4,
                "org_name": "NJHPS SJVN LTD"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013500699894439936287",
                "total_points": null,
                "row_num": 84,
                "total_users": 2,
                "org_name": "testcbpmarch"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01377743336031846411",
                "total_points": null,
                "row_num": 85,
                "total_users": 1,
                "org_name": "Diesel Locomotive Works Varanasi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382399527587840031",
                "total_points": null,
                "row_num": 86,
                "total_users": 1,
                "org_name": "Forest and Environment Department Odisha"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01390265150373068829",
                "total_points": null,
                "row_num": 87,
                "total_users": 1,
                "org_name": "Shellac and Forest Products Export Promotion Council Kolkata"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380136308844134454",
                "total_points": null,
                "row_num": 88,
                "total_users": 1,
                "org_name": "Ministry of Earth Sciences"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376187695259648041",
                "total_points": null,
                "row_num": 89,
                "total_users": 11,
                "org_name": "Indian Council of Medical Research (ICMR)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385175097608601693",
                "total_points": null,
                "row_num": 90,
                "total_users": 1,
                "org_name": "Western Coalfields Ltd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385598264709120020",
                "total_points": null,
                "row_num": 91,
                "total_users": 1,
                "org_name": "Sai State"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013834026787315712115",
                "total_points": null,
                "row_num": 92,
                "total_users": 2,
                "org_name": "SURVEY OF INDIA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140846146226176001",
                "total_points": null,
                "row_num": 93,
                "total_users": 1,
                "org_name": "Biharrr"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013857942434496512101",
                "total_points": null,
                "row_num": 94,
                "total_users": 1,
                "org_name": "Central Public Works Department (CPWD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01361099635102515295",
                "total_points": null,
                "row_num": 95,
                "total_users": 2,
                "org_name": "PUNJAB"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358993109980774453",
                "total_points": null,
                "row_num": 96,
                "total_users": 1,
                "org_name": "DAMAN & DIU"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838328336261120236",
                "total_points": null,
                "row_num": 97,
                "total_users": 1,
                "org_name": "Indian Railway Stations Development Corporation Limited"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013685311953264640133",
                "total_points": null,
                "row_num": 98,
                "total_users": 3,
                "org_name": "DG of Defence Estate"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376252146242355245",
                "total_points": null,
                "row_num": 99,
                "total_users": 1,
                "org_name": "OFFICE OF THE DGADS NEW DELHI"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013627397001453568158",
                "total_points": null,
                "row_num": 100,
                "total_users": 2,
                "org_name": "Arth Evam Sankhya Prabhag"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013633061006516224182",
                "total_points": null,
                "row_num": 101,
                "total_users": 1,
                "org_name": "e-Suvidha A Public Utility Interface"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013634326241591296189",
                "total_points": null,
                "row_num": 102,
                "total_users": 2,
                "org_name": "Films Division Ministry of Information and Broadcasting"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366841101891993635",
                "total_points": null,
                "row_num": 103,
                "total_users": 1,
                "org_name": "Directorate of Handloom and Textiles Government of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013784505342812160151",
                "total_points": null,
                "row_num": 104,
                "total_users": 4,
                "org_name": "Department of Legal Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359131823008153684",
                "total_points": null,
                "row_num": 105,
                "total_users": 1,
                "org_name": "DADRA & NAGAR HAVELI"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385870092979404865",
                "total_points": null,
                "row_num": 106,
                "total_users": 2,
                "org_name": "Planning Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384676855374643222",
                "total_points": null,
                "row_num": 107,
                "total_users": 4,
                "org_name": "Radhesh MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866571430404096291",
                "total_points": null,
                "row_num": 108,
                "total_users": 2,
                "org_name": "cbp-new delhi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359469147919155298",
                "total_points": null,
                "row_num": 109,
                "total_users": 1,
                "org_name": "Ministry of Law and Justice"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372713621613772834",
                "total_points": null,
                "row_num": 110,
                "total_users": 1,
                "org_name": "OFFICE OF THE AG AUDIT TRIPURA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044257562624066",
                "total_points": null,
                "row_num": 111,
                "total_users": 3,
                "org_name": "Cochin University of Science and Technology (CUSAT)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013852394237181952107",
                "total_points": null,
                "row_num": 112,
                "total_users": 1,
                "org_name": "Home Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134476525713326087",
                "total_points": null,
                "row_num": 113,
                "total_users": 1,
                "org_name": "Personnel  and  Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359045143774822474",
                "total_points": null,
                "row_num": 114,
                "total_users": 10,
                "org_name": "AAICLAS"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013620438976643072137",
                "total_points": null,
                "row_num": 115,
                "total_users": 4,
                "org_name": "NA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139126943544197126",
                "total_points": null,
                "row_num": 116,
                "total_users": 2,
                "org_name": "Ministry of Sportz"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132868817112842240",
                "total_points": null,
                "row_num": 117,
                "total_users": 4,
                "org_name": "Testing"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373706594001715274",
                "total_points": null,
                "row_num": 118,
                "total_users": 5,
                "org_name": "CPB Provider Testing"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044707876044868",
                "total_points": null,
                "row_num": 119,
                "total_users": 1,
                "org_name": "Higher Education Department Kerala"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141906246775029763",
                "total_points": null,
                "row_num": 120,
                "total_users": 1,
                "org_name": "PONDICHERRY"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01344769730810675214",
                "total_points": null,
                "row_num": 121,
                "total_users": 1,
                "org_name": "Training & Test"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140802491947827204",
                "total_points": null,
                "row_num": 122,
                "total_users": 1,
                "org_name": "Information and Broadcasting Department Gujarat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372274107909734412",
                "total_points": null,
                "row_num": 123,
                "total_users": 1,
                "org_name": "National Institute of Public Cooperation and Child Development (NIPCCD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013841115205222400305",
                "total_points": null,
                "row_num": 124,
                "total_users": 2,
                "org_name": "Department of Pharmaceuticals"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013690250168123392178",
                "total_points": null,
                "row_num": 125,
                "total_users": 37,
                "org_name": "Border Road Organisation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376813510499532857",
                "total_points": null,
                "row_num": 126,
                "total_users": 3,
                "org_name": "U.P. Academy of Administration & Management (UPAAM) Govt. of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013793800231510016133",
                "total_points": null,
                "row_num": 127,
                "total_users": 2,
                "org_name": "Tripura State Electricity Corporation Limited"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013841111229448192306",
                "total_points": null,
                "row_num": 128,
                "total_users": 1,
                "org_name": "Ministry of Chemicals and Fertilizers"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013787839365193728200",
                "total_points": null,
                "row_num": 129,
                "total_users": 1,
                "org_name": "Government Organization"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379226738616729622",
                "total_points": null,
                "row_num": 130,
                "total_users": 2,
                "org_name": "Rail Budget 2016 Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359131910031769679",
                "total_points": null,
                "row_num": 131,
                "total_users": 2,
                "org_name": "JAMMU & KASHMIR"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138558943525601288",
                "total_points": null,
                "row_num": 132,
                "total_users": 1,
                "org_name": "Parliamentary Affairs Department Maharashtra"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382411681533952068",
                "total_points": null,
                "row_num": 133,
                "total_users": 1,
                "org_name": "KARNATAKA TRADE PROMOTION ORGANIZATION"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013703646888394752207",
                "total_points": null,
                "row_num": 134,
                "total_users": 32,
                "org_name": "Food Corporation of India (FCI)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01388490495659212829",
                "total_points": null,
                "row_num": 135,
                "total_users": 1,
                "org_name": "Social Welfare (Sanik Kalyan) Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135785268271513607",
                "total_points": null,
                "row_num": 136,
                "total_users": 3,
                "org_name": "DELHI"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132620292584243200",
                "total_points": null,
                "row_num": 137,
                "total_users": 1,
                "org_name": "BESCOM"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134476592354099208",
                "total_points": null,
                "row_num": 138,
                "total_users": 1,
                "org_name": "KarthikTestCBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01405899873288192024",
                "total_points": null,
                "row_num": 139,
                "total_users": 1,
                "org_name": "Ministry of  Renewable energy resource"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01344766896078848010",
                "total_points": null,
                "row_num": 140,
                "total_users": 65,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358834130544230431",
                "total_points": null,
                "row_num": 141,
                "total_users": 6,
                "org_name": "North Eastern Regional Power Committee"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384311140161126413",
                "total_points": null,
                "row_num": 142,
                "total_users": 1,
                "org_name": "Department of Heavy Industry"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376822290813747263",
                "total_points": null,
                "row_num": 143,
                "total_users": 434,
                "org_name": "TarentoCBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013837462555222016184",
                "total_points": null,
                "row_num": 144,
                "total_users": 3,
                "org_name": "Telaangana"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373714214256640083",
                "total_points": null,
                "row_num": 145,
                "total_users": 5,
                "org_name": "sathya CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374897150722048016",
                "total_points": null,
                "row_num": 146,
                "total_users": 1,
                "org_name": "Southern Regional Power Committee"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013417772493185024682",
                "total_points": null,
                "row_num": 147,
                "total_users": 58,
                "org_name": "NIRDPR National Institute of Rural Development and Panchayati Raj"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044011375001658",
                "total_points": null,
                "row_num": 148,
                "total_users": 2,
                "org_name": "S N Bose National Centre for Basic Sciences (SNBNCBS)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385373526314188813",
                "total_points": null,
                "row_num": 149,
                "total_users": 2,
                "org_name": "Labour Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013694620504326144197",
                "total_points": null,
                "row_num": 150,
                "total_users": 2,
                "org_name": "Ministry of Textiles"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135394856342896646",
                "total_points": null,
                "row_num": 151,
                "total_users": 2,
                "org_name": "Igot Mdo"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384674984551219213",
                "total_points": null,
                "row_num": 152,
                "total_users": 368,
                "org_name": "Mahesh MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134157287914864641",
                "total_points": null,
                "row_num": 153,
                "total_users": 30,
                "org_name": "CBI Academy"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013845995847696384105",
                "total_points": null,
                "row_num": 154,
                "total_users": 1,
                "org_name": "Bharat Broadband Network Limited (BBNL)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359469224475852896",
                "total_points": null,
                "row_num": 155,
                "total_users": 1,
                "org_name": "The High Court of Judicature at Patna"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137202325057617923",
                "total_points": null,
                "row_num": 156,
                "total_users": 1,
                "org_name": "ESI Corporation Sub Regional Office Nagpur"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358067059907788810",
                "total_points": null,
                "row_num": 157,
                "total_users": 2,
                "org_name": "Assam Energy Development Agency (AEDA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379325777339187290",
                "total_points": null,
                "row_num": 158,
                "total_users": 1,
                "org_name": "GUJARAT"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379307180892160061",
                "total_points": null,
                "row_num": 159,
                "total_users": 1,
                "org_name": "Finance_organisation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013594694782582784100",
                "total_points": null,
                "row_num": 160,
                "total_users": 1,
                "org_name": "LADAKH"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359043884062310460",
                "total_points": null,
                "row_num": 161,
                "total_users": 1,
                "org_name": "Intelligence Bureau"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384675536621568015",
                "total_points": null,
                "row_num": 162,
                "total_users": 91,
                "org_name": "Shankar MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135806584098570246",
                "total_points": null,
                "row_num": 163,
                "total_users": 2,
                "org_name": "AIR INDIA LTD"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01375683075607756827",
                "total_points": null,
                "row_num": 164,
                "total_users": 1,
                "org_name": "National Security Council"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373715147098521691",
                "total_points": null,
                "row_num": 165,
                "total_users": 1,
                "org_name": "MIZORAM"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135962841564774408",
                "total_points": null,
                "row_num": 166,
                "total_users": 24,
                "org_name": "Ministry of Railways"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134892418324234245",
                "total_points": null,
                "row_num": 167,
                "total_users": 1,
                "org_name": "testcbpseven all"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138029617471488002",
                "total_points": null,
                "row_num": 168,
                "total_users": 1,
                "org_name": "QA organisation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379302709590425648",
                "total_points": null,
                "row_num": 169,
                "total_users": 1,
                "org_name": "Planning Commission (Archival Website)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382344087628185614",
                "total_points": null,
                "row_num": 170,
                "total_users": 4,
                "org_name": "Controller General of Patents Designs and Trade Marks (CGPDTM) Mumbai"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138141926497320964",
                "total_points": null,
                "row_num": 171,
                "total_users": 1,
                "org_name": "Department of Defence Production"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138212612013998086",
                "total_points": null,
                "row_num": 172,
                "total_users": 1,
                "org_name": "National Institute of Social Defence (NISD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013704373873598464221",
                "total_points": null,
                "row_num": 173,
                "total_users": 2,
                "org_name": "Civil Supplies and Consumer Affairs Department Andaman & Nicobar"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013704547956629504226",
                "total_points": null,
                "row_num": 174,
                "total_users": 1,
                "org_name": "Department of Agriculture Cooperation and Farmers Welfare"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360673915855667266",
                "total_points": null,
                "row_num": 175,
                "total_users": 2,
                "org_name": "NA (PMO)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366908440266342441",
                "total_points": null,
                "row_num": 176,
                "total_users": 2,
                "org_name": "Controller General of Accounts (CGA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01344770342046924817",
                "total_points": null,
                "row_num": 177,
                "total_users": 16,
                "org_name": "Personnel & Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013694500545683456195",
                "total_points": null,
                "row_num": 178,
                "total_users": 1,
                "org_name": "DG ATVP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013787900185239552202",
                "total_points": null,
                "row_num": 179,
                "total_users": 1,
                "org_name": "Finance Department Daman and Diu"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138036005433098242",
                "total_points": null,
                "row_num": 180,
                "total_users": 3,
                "org_name": "Tarang Sanchar Portal by Department of Telecommunications (DoT)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013846223295750144127",
                "total_points": null,
                "row_num": 181,
                "total_users": 1,
                "org_name": "department of revenue"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0136501458849792002",
                "total_points": null,
                "row_num": 182,
                "total_users": 5,
                "org_name": "Indian Army"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01387373162560716847",
                "total_points": null,
                "row_num": 183,
                "total_users": 1,
                "org_name": "Indian Institute of Public Administration (IIPA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137731899039252480",
                "total_points": null,
                "row_num": 184,
                "total_users": 4,
                "org_name": "test"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01397618173831577617",
                "total_points": null,
                "row_num": 185,
                "total_users": 7,
                "org_name": "Aparna MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013872231679262720217",
                "total_points": null,
                "row_num": 186,
                "total_users": 1,
                "org_name": "Ministry of Steel"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01419917302426009617",
                "total_points": null,
                "row_num": 187,
                "total_users": 2,
                "org_name": "Assam Organisation four"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013793792274522112131",
                "total_points": null,
                "row_num": 188,
                "total_users": 1,
                "org_name": "Krishi Vigyan Kendra South Tripura"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140216632523161600",
                "total_points": null,
                "row_num": 189,
                "total_users": 1,
                "org_name": "ISB"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013846656088899584133",
                "total_points": null,
                "row_num": 190,
                "total_users": 1,
                "org_name": "Sai Test"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385736594736742483",
                "total_points": null,
                "row_num": 191,
                "total_users": 1,
                "org_name": "Ministry of Civil Aviation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01354383440999219234",
                "total_points": null,
                "row_num": 192,
                "total_users": 21,
                "org_name": "SundarCBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013707309556899840228",
                "total_points": null,
                "row_num": 193,
                "total_users": 4,
                "org_name": "Department of Defence"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013837484744278016193",
                "total_points": null,
                "row_num": 194,
                "total_users": 3,
                "org_name": "Employees State Insuarnce Corporation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013630916509294592179",
                "total_points": null,
                "row_num": 195,
                "total_users": 1,
                "org_name": "TRIPURA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013793584981893120116",
                "total_points": null,
                "row_num": 196,
                "total_users": 82,
                "org_name": "Employees State Insurance Corporation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376823579100774472",
                "total_points": null,
                "row_num": 197,
                "total_users": 2,
                "org_name": "water resource"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013840971229683712298",
                "total_points": null,
                "row_num": 198,
                "total_users": 1,
                "org_name": "MSME Testing Station"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044375616716872",
                "total_points": null,
                "row_num": 199,
                "total_users": 3,
                "org_name": "MEGHALAYA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135792011403427849",
                "total_points": null,
                "row_num": 200,
                "total_users": 1,
                "org_name": "Delhi Parks and Gardens Society Department of Environment"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135366664642232328",
                "total_points": null,
                "row_num": 201,
                "total_users": 2,
                "org_name": "Open Source Tech Dev"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358903917383680037",
                "total_points": null,
                "row_num": 202,
                "total_users": 1,
                "org_name": "Department of PWD Assam"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141976985793003529",
                "total_points": null,
                "row_num": 203,
                "total_users": 1,
                "org_name": "Tarento Mobile Organisation One"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384391432829337658",
                "total_points": null,
                "row_num": 204,
                "total_users": 1,
                "org_name": "REGIONAL TRAINING INSTITUTE NEW DELHI"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138290439635517441557",
                "total_points": null,
                "row_num": 205,
                "total_users": 1,
                "org_name": "Universal Service Obligation Fund (USOF)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380640918328115220",
                "total_points": null,
                "row_num": 206,
                "total_users": 2,
                "org_name": "Chennai Port Trust"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385535463419904058",
                "total_points": null,
                "row_num": 207,
                "total_users": 6,
                "org_name": "Central Board of Direct Taxes (CBDT)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385594531063398413",
                "total_points": null,
                "row_num": 208,
                "total_users": 2,
                "org_name": "Khadi and Village Indutries Commission (KVIC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01375680598713139225",
                "total_points": null,
                "row_num": 209,
                "total_users": 1,
                "org_name": "ATI MAHARASHTRA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358914361008947245",
                "total_points": null,
                "row_num": 210,
                "total_users": 1,
                "org_name": "HIMACHAL PRADESH"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01424955211735859224",
                "total_points": null,
                "row_num": 211,
                "total_users": 2,
                "org_name": "Testing AR Org"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138043201608089602",
                "total_points": null,
                "row_num": 212,
                "total_users": 49,
                "org_name": "RKCbp"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013633005407862784180",
                "total_points": null,
                "row_num": 213,
                "total_users": 1,
                "org_name": "Ministry of Coal"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358129015016652813",
                "total_points": null,
                "row_num": 214,
                "total_users": 1,
                "org_name": "Airports Authority of India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135956610592686083",
                "total_points": null,
                "row_num": 215,
                "total_users": 1,
                "org_name": "NA (DOR)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359693287062732810",
                "total_points": null,
                "row_num": 216,
                "total_users": 13,
                "org_name": "Department Of Posts"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385090604634931226",
                "total_points": null,
                "row_num": 217,
                "total_users": 1,
                "org_name": "Ministry of Housing and Urban Poverty Alleviation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139154529409433600",
                "total_points": null,
                "row_num": 218,
                "total_users": 1,
                "org_name": "RAJYA SAMPATTI NIDESHALAYA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013783094970023936103",
                "total_points": null,
                "row_num": 219,
                "total_users": 5,
                "org_name": "Ministry of Mines"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01383336842061414497",
                "total_points": null,
                "row_num": 220,
                "total_users": 3,
                "org_name": "Ministry of Commerce and Industry"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01417019411195494424",
                "total_points": null,
                "row_num": 221,
                "total_users": 4,
                "org_name": "RKTestCBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013738426584842240110",
                "total_points": null,
                "row_num": 222,
                "total_users": 3,
                "org_name": "Rural Diksha Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01381906997392179224",
                "total_points": null,
                "row_num": 223,
                "total_users": 3,
                "org_name": "Department of Expenditure"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0140853914159759362",
                "total_points": null,
                "row_num": 224,
                "total_users": 2,
                "org_name": "Rajasthan"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385186960937779298",
                "total_points": null,
                "row_num": 225,
                "total_users": 4,
                "org_name": "Sahil MDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138212654081064967",
                "total_points": null,
                "row_num": 226,
                "total_users": 1,
                "org_name": "Department of Social Justice and Empowerment"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374276245304934424",
                "total_points": null,
                "row_num": 227,
                "total_users": 1,
                "org_name": "AIR India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385606244985241623",
                "total_points": null,
                "row_num": 228,
                "total_users": 1,
                "org_name": "North Eastern Railway"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135359738922352645",
                "total_points": null,
                "row_num": 229,
                "total_users": 2,
                "org_name": "ostd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384739322653081641",
                "total_points": null,
                "row_num": 230,
                "total_users": 1,
                "org_name": "Ministry of Statistics and Programme Implementation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01353677983645696018",
                "total_points": null,
                "row_num": 231,
                "total_users": 4,
                "org_name": "OSTD CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142290490996326409",
                "total_points": null,
                "row_num": 232,
                "total_users": 1,
                "org_name": "ministry of navi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013826080908025856107",
                "total_points": null,
                "row_num": 233,
                "total_users": 5,
                "org_name": "Ministry of testing"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376825947137638478",
                "total_points": null,
                "row_num": 234,
                "total_users": 2,
                "org_name": "Comptroller and Auditor General (CAG) of India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013699387929051136203",
                "total_points": null,
                "row_num": 235,
                "total_users": 2,
                "org_name": "Office of JS and Chief Administrative Officer"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380153481512550414",
                "total_points": null,
                "row_num": 236,
                "total_users": 1,
                "org_name": "Institute For Design Of Electrical Measuring Instruments Mumbai"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01357986184999731216",
                "total_points": null,
                "row_num": 237,
                "total_users": 2,
                "org_name": "Medical Education Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138015199198740489",
                "total_points": null,
                "row_num": 238,
                "total_users": 1,
                "org_name": "REGIONAL RURAL BANKS"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360619366100172863",
                "total_points": null,
                "row_num": 239,
                "total_users": 19,
                "org_name": "Prime Minister Office (PMO)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358912553238528043",
                "total_points": null,
                "row_num": 240,
                "total_users": 1,
                "org_name": "SRI BHAJAN EMPPLOYMENT BOOK CENTER"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132593264095559687",
                "total_points": null,
                "row_num": 241,
                "total_users": 13,
                "org_name": "UDEMY"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137980951196385286",
                "total_points": null,
                "row_num": 242,
                "total_users": 1,
                "org_name": "Sundarban Affairs Department West Bengal"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013787350229024768185",
                "total_points": null,
                "row_num": 243,
                "total_users": 1,
                "org_name": "Department of Justice"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138425823431475204",
                "total_points": null,
                "row_num": 244,
                "total_users": 1,
                "org_name": "Insolvency and Bankruptcy Board of India (IBBI)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013846004568539136107",
                "total_points": null,
                "row_num": 245,
                "total_users": 3,
                "org_name": "Ministry of Railway"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013871541254152192177",
                "total_points": null,
                "row_num": 246,
                "total_users": 1,
                "org_name": "Central Secretariat Service(CSS) Officers - Annual Performance Appraisal Report (APAR) Monitoring System"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0133724721041817601",
                "total_points": null,
                "row_num": 247,
                "total_users": 10,
                "org_name": "ICMR"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358336744676556821",
                "total_points": null,
                "row_num": 248,
                "total_users": 2,
                "org_name": "ARUNACHAL PRADESH"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385745633121894491",
                "total_points": null,
                "row_num": 249,
                "total_users": 1,
                "org_name": "Centre for DNA Fingerprinting and Diagnostics (CDFD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360687675989196874",
                "total_points": null,
                "row_num": 250,
                "total_users": 4,
                "org_name": "Department Of Personnel"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379928534342860824",
                "total_points": null,
                "row_num": 251,
                "total_users": 1,
                "org_name": "ACCOUNT MSME"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142289487474851846",
                "total_points": null,
                "row_num": 252,
                "total_users": 1,
                "org_name": "Political pension"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013620447849873408139",
                "total_points": null,
                "row_num": 253,
                "total_users": 1,
                "org_name": "Legal"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372776953881395244",
                "total_points": null,
                "row_num": 254,
                "total_users": 13,
                "org_name": "Sashastra Seema Bal (SSB)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385813179805696032",
                "total_points": null,
                "row_num": 255,
                "total_users": 5,
                "org_name": "Department one"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013644245848031232311",
                "total_points": null,
                "row_num": 256,
                "total_users": 4,
                "org_name": "Post Graduate Institute of Child Health"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013640725777645568308",
                "total_points": null,
                "row_num": 257,
                "total_users": 2,
                "org_name": "General Administration Department Meghalaya"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384891735923916894",
                "total_points": null,
                "row_num": 258,
                "total_users": 1,
                "org_name": "Chhattisgarh Postal Circle"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044182666444870",
                "total_points": null,
                "row_num": 259,
                "total_users": 1,
                "org_name": "KERALA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382408888970444844",
                "total_points": null,
                "row_num": 260,
                "total_users": 3,
                "org_name": "Directorate General of Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135791278113095686",
                "total_points": null,
                "row_num": 261,
                "total_users": 3,
                "org_name": "General Administration Ladakh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384737210671923236",
                "total_points": null,
                "row_num": 262,
                "total_users": 1,
                "org_name": "State Institute of Public Administration and Rural Development (SIPARD)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013796550145433600201",
                "total_points": null,
                "row_num": 263,
                "total_users": 8,
                "org_name": "Ministry of Labour and Employment"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360764933497651281",
                "total_points": null,
                "row_num": 264,
                "total_users": 1,
                "org_name": "Construction Organisation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360604764241920055",
                "total_points": null,
                "row_num": 265,
                "total_users": 53,
                "org_name": "CBIC CENTRAL BOARD OF INDIRECT TAXES & CUSTOMS"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01355941649063936029",
                "total_points": null,
                "row_num": 266,
                "total_users": 15,
                "org_name": "CBP PORTAL "
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374911668681113626",
                "total_points": null,
                "row_num": 267,
                "total_users": 3,
                "org_name": "Ministry of data"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360972308660224086",
                "total_points": null,
                "row_num": 268,
                "total_users": 76,
                "org_name": "Indo Tibetan Border Police (ITBP)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013614668388343808118",
                "total_points": null,
                "row_num": 269,
                "total_users": 8,
                "org_name": "Ministry of Education"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359044163020390464",
                "total_points": null,
                "row_num": 270,
                "total_users": 17,
                "org_name": "Ministry of Home Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138022298289520642",
                "total_points": null,
                "row_num": 271,
                "total_users": 4,
                "org_name": "National Informatics Centre (NIC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013633098358669312185",
                "total_points": null,
                "row_num": 272,
                "total_users": 3,
                "org_name": "OFFICE OF CHIEF CONTROLLER OF ACCOUNT"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373278785184563265",
                "total_points": null,
                "row_num": 273,
                "total_users": 1,
                "org_name": "Field Operations Division"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866600509988864305",
                "total_points": null,
                "row_num": 274,
                "total_users": 1,
                "org_name": "Electronics and Information Technology Department"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141894029422755841",
                "total_points": null,
                "row_num": 275,
                "total_users": 1,
                "org_name": "Sohith Org"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0142133123046850560",
                "total_points": null,
                "row_num": 276,
                "total_users": 7,
                "org_name": "Department of Personnel and Training DoPT"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135054866668503042",
                "total_points": null,
                "row_num": 277,
                "total_users": 3,
                "org_name": "spv portal dept"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380136685898137653",
                "total_points": null,
                "row_num": 278,
                "total_users": 1,
                "org_name": "Departmental Accounting Organization"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01387437091878502465",
                "total_points": null,
                "row_num": 279,
                "total_users": 1,
                "org_name": "General Administration Department (GAD) Jammu and Kashmir"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373714330840268881",
                "total_points": null,
                "row_num": 280,
                "total_users": 1,
                "org_name": "Testing CBP p"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359467868939878491",
                "total_points": null,
                "row_num": 281,
                "total_users": 2,
                "org_name": "Gulbarga Electricity Supply Company (GESCOM)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374905340651929624",
                "total_points": null,
                "row_num": 282,
                "total_users": 2,
                "org_name": "ODISHA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373837973956198497",
                "total_points": null,
                "row_num": 283,
                "total_users": 3,
                "org_name": "CBP-digital India"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01422392475477606425",
                "total_points": null,
                "row_num": 284,
                "total_users": 4,
                "org_name": "Organisation for testing sbrootorg id  three"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013708840454520832231",
                "total_points": null,
                "row_num": 285,
                "total_users": 1,
                "org_name": "REGIONAL PAY AND ACCOUNTS OFFICE CRPF KOLKATA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134892390443581443",
                "total_points": null,
                "row_num": 286,
                "total_users": 3,
                "org_name": "testcbp"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374261146930380810",
                "total_points": null,
                "row_num": 287,
                "total_users": 1,
                "org_name": "Marine Products Export Development Authority (MPEDA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358833364554547230",
                "total_points": null,
                "row_num": 288,
                "total_users": 1,
                "org_name": "International Centre for Alternative Dispute Resolution (ICADR)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382495799051878496",
                "total_points": null,
                "row_num": 289,
                "total_users": 1,
                "org_name": "Commissionerate of Labour Labour & Employment Department Government of Gujarat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376824514990080075",
                "total_points": null,
                "row_num": 290,
                "total_users": 2,
                "org_name": "criminal law"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137449351019724806",
                "total_points": null,
                "row_num": 291,
                "total_users": 1,
                "org_name": "kerala state"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358912293839667241",
                "total_points": null,
                "row_num": 292,
                "total_users": 1,
                "org_name": "UTTARAKHAND"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013704327184826368217",
                "total_points": null,
                "row_num": 293,
                "total_users": 3,
                "org_name": "Indian Air Force"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137987402065346563",
                "total_points": null,
                "row_num": 294,
                "total_users": 1,
                "org_name": "INDIA POST PAYMENT BANK Limited"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013842418804776960360",
                "total_points": null,
                "row_num": 295,
                "total_users": 2,
                "org_name": "Testing Ministry"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013688248592531456170",
                "total_points": null,
                "row_num": 296,
                "total_users": 1,
                "org_name": "West Bengal Postal Circle"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013797398677397504229",
                "total_points": null,
                "row_num": 297,
                "total_users": 1,
                "org_name": "Directorate General of Lighthouses and Lightships"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379298447061811241",
                "total_points": null,
                "row_num": 298,
                "total_users": 3,
                "org_name": "Ministry of Water Resources River Development and Ganga Rejuvenation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013787321083092992181",
                "total_points": null,
                "row_num": 299,
                "total_users": 12,
                "org_name": "Indian Bureau of Mines"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01383232892665856074",
                "total_points": null,
                "row_num": 300,
                "total_users": 1,
                "org_name": "Recruitment Rules Formulation Amendment and Monitoring System Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134425930254827520",
                "total_points": null,
                "row_num": 301,
                "total_users": 5,
                "org_name": "Indian Institute of Public Administration"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385881088909312069",
                "total_points": null,
                "row_num": 302,
                "total_users": 1,
                "org_name": "Karnataka State Pharmacy Council (KSPC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374897031639859217",
                "total_points": null,
                "row_num": 303,
                "total_users": 2,
                "org_name": "Central Power Research Institute (CPRI) Bangalore Karnataka"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01367269191414579250",
                "total_points": null,
                "row_num": 304,
                "total_users": 1,
                "org_name": "Jammu and Kashmir Police"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01373833896865792095",
                "total_points": null,
                "row_num": 305,
                "total_users": 5,
                "org_name": "Apex Bodies"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385882883198976073",
                "total_points": null,
                "row_num": 306,
                "total_users": 1,
                "org_name": "Uttar Pradesh Police"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384825888804864076",
                "total_points": null,
                "row_num": 307,
                "total_users": 2,
                "org_name": "Ministry of Rural Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013857947568422912106",
                "total_points": null,
                "row_num": 308,
                "total_users": 2,
                "org_name": "Parliamentary Affairs Department Mantralaya"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838837971042304248",
                "total_points": null,
                "row_num": 309,
                "total_users": 1,
                "org_name": "Department of Food and Public Distribution"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01388705627652915213",
                "total_points": null,
                "row_num": 310,
                "total_users": 1,
                "org_name": "Kendriya Sainik Board Secretariat (KSB) Ministry of Defence"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013621026964987904143",
                "total_points": null,
                "row_num": 311,
                "total_users": 1,
                "org_name": "Center of Biomedical Magnetic Resonance Lucknow"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013833406554652672103",
                "total_points": null,
                "row_num": 312,
                "total_users": 1,
                "org_name": "National Industrial Corridor Development Corporation Limited"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01367766432250265661",
                "total_points": null,
                "row_num": 313,
                "total_users": 1,
                "org_name": "TELANGANA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01381850232002150410",
                "total_points": null,
                "row_num": 314,
                "total_users": 1,
                "org_name": "Department of Scientific and Industrial Research (DSIR)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013826788802347008169",
                "total_points": null,
                "row_num": 315,
                "total_users": 1,
                "org_name": "Dena bank"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132622588908339201",
                "total_points": null,
                "row_num": 316,
                "total_users": 9,
                "org_name": "STQC"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013787458017320960194",
                "total_points": null,
                "row_num": 317,
                "total_users": 5,
                "org_name": "Geological Survey of India (GSI)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385145650103091267",
                "total_points": null,
                "row_num": 318,
                "total_users": 1,
                "org_name": "Central Railway"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374912209870848027",
                "total_points": null,
                "row_num": 319,
                "total_users": 1,
                "org_name": "Department of data"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01383124306335334452",
                "total_points": null,
                "row_num": 320,
                "total_users": 1,
                "org_name": "Circular Management Information System"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013623888315121664147",
                "total_points": null,
                "row_num": 321,
                "total_users": 45,
                "org_name": "Border Security Force (BSF)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01382199056048128031",
                "total_points": null,
                "row_num": 322,
                "total_users": 3,
                "org_name": "Rajya Sabha Secretariat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013614665778569216116",
                "total_points": null,
                "row_num": 323,
                "total_users": 1,
                "org_name": "Bodoland Administrative Staff College"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013693149388513280187",
                "total_points": null,
                "row_num": 324,
                "total_users": 2,
                "org_name": "National Authority for Chemical Weapons Convention (NACWC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01381671627150131224",
                "total_points": null,
                "row_num": 325,
                "total_users": 1,
                "org_name": "Department of Science and Technology (DST)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01381906916850892825",
                "total_points": null,
                "row_num": 326,
                "total_users": 2,
                "org_name": "Ministry of Finance"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838893186351104258",
                "total_points": null,
                "row_num": 327,
                "total_users": 1,
                "org_name": "Raghib CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013704495984009216223",
                "total_points": null,
                "row_num": 328,
                "total_users": 15,
                "org_name": "Controller General of Defence Accounts"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137900357480038404",
                "total_points": null,
                "row_num": 329,
                "total_users": 9,
                "org_name": "Central Reserve Police Force (CRPF)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013710081026138112237",
                "total_points": null,
                "row_num": 330,
                "total_users": 4,
                "org_name": "Ministry of Defence"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384384494908211246",
                "total_points": null,
                "row_num": 331,
                "total_users": 1,
                "org_name": "Central Staffing Scheme Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137450259945390088",
                "total_points": null,
                "row_num": 332,
                "total_users": 1,
                "org_name": "Indian Institute of Tecnhnology"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385304990398873613",
                "total_points": null,
                "row_num": 333,
                "total_users": 2,
                "org_name": "Department of Financial Services"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01381901507081830417",
                "total_points": null,
                "row_num": 334,
                "total_users": 4,
                "org_name": "National Rural Livelihoods Mission (NRLM) - Aajeevika"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360602496242483252",
                "total_points": null,
                "row_num": 335,
                "total_users": 1,
                "org_name": "National Academy of Indian Railways"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385076907907481615",
                "total_points": null,
                "row_num": 336,
                "total_users": 9,
                "org_name": "Employees State Insurance Corporation (ESIC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0132593323141201929",
                "total_points": null,
                "row_num": 337,
                "total_users": 14,
                "org_name": "DOPI"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01367546072115609633",
                "total_points": null,
                "row_num": 338,
                "total_users": 3,
                "org_name": "National Judicial Academy Bhopal"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379300286193664044",
                "total_points": null,
                "row_num": 339,
                "total_users": 2,
                "org_name": "Department of Consumer Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866588369567744294",
                "total_points": null,
                "row_num": 340,
                "total_users": 9,
                "org_name": "ravicbp"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138827731090554883",
                "total_points": null,
                "row_num": 341,
                "total_users": 1,
                "org_name": "Fisheries Department Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376743249867571249",
                "total_points": null,
                "row_num": 342,
                "total_users": 2,
                "org_name": "Autonomous Body"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374269161131212813",
                "total_points": null,
                "row_num": 343,
                "total_users": 1,
                "org_name": "Special Protection Group (SPG)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0136507096703139844",
                "total_points": null,
                "row_num": 344,
                "total_users": 1,
                "org_name": "Civil Construction Wing All India Radio"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138015153857495047",
                "total_points": null,
                "row_num": 345,
                "total_users": 1,
                "org_name": "BANKING SECTOR"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358911309859225639",
                "total_points": null,
                "row_num": 346,
                "total_users": 1,
                "org_name": "CE RO Office MoRTH Bengaluru"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013709384341602304233",
                "total_points": null,
                "row_num": 347,
                "total_users": 1,
                "org_name": "Office of Deputy Director General Sikkim DoT"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359468760251596894",
                "total_points": null,
                "row_num": 348,
                "total_users": 5,
                "org_name": "Advisor Office"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01384392945143808064",
                "total_points": null,
                "row_num": 349,
                "total_users": 2,
                "org_name": "Ministry of Sports"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135791263737364484",
                "total_points": null,
                "row_num": 350,
                "total_users": 1,
                "org_name": "Indraprastha Power Generation Co. Ltd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366259031639654410",
                "total_points": null,
                "row_num": 351,
                "total_users": 1,
                "org_name": "NTPC limited-SRHQ sadan region headquarter"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137199859655229442",
                "total_points": null,
                "row_num": 352,
                "total_users": 1,
                "org_name": "PAG ERSA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359342801614438486",
                "total_points": null,
                "row_num": 353,
                "total_users": 2,
                "org_name": "Project Progress Monitoring System"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013840211303628800286",
                "total_points": null,
                "row_num": 354,
                "total_users": 1,
                "org_name": "Central Armed Police Forces"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358914521880166446",
                "total_points": null,
                "row_num": 355,
                "total_users": 1,
                "org_name": "Block Development Officer"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139998612105216007",
                "total_points": null,
                "row_num": 356,
                "total_users": 4,
                "org_name": "DRDO"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135954357612625920",
                "total_points": null,
                "row_num": 357,
                "total_users": 2,
                "org_name": "NTPC Tamilnadu Energy Company Ltd"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135071359030722569",
                "total_points": null,
                "row_num": 358,
                "total_users": 243,
                "org_name": "Karmayogi Bharat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358340065167769623",
                "total_points": null,
                "row_num": 359,
                "total_users": 1,
                "org_name": "JPAL New"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013837440604364800177",
                "total_points": null,
                "row_num": 360,
                "total_users": 2,
                "org_name": "Tel1"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013738410017947648102",
                "total_points": null,
                "row_num": 361,
                "total_users": 4,
                "org_name": "MAHARASHTRA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013872898519187456276",
                "total_points": null,
                "row_num": 362,
                "total_users": 1,
                "org_name": "Election Department Delhi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135806574152417284",
                "total_points": null,
                "row_num": 363,
                "total_users": 1,
                "org_name": "NTPC-SMTPS"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358133618012160016",
                "total_points": null,
                "row_num": 364,
                "total_users": 4,
                "org_name": "Cattle and Dairy Development Division Department"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366832637070540821",
                "total_points": null,
                "row_num": 365,
                "total_users": 1,
                "org_name": "DISTRICT COURT RUDRAPRAYAG"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013826229980823552144",
                "total_points": null,
                "row_num": 366,
                "total_users": 2,
                "org_name": "Press Information Bureau (PIB)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01389120321445068833",
                "total_points": null,
                "row_num": 367,
                "total_users": 1,
                "org_name": "North Western Railway"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01387364496885350432",
                "total_points": null,
                "row_num": 368,
                "total_users": 1,
                "org_name": "Board of Revenue Government of Uttar Pradesh"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01366840048450764834",
                "total_points": null,
                "row_num": 369,
                "total_users": 1,
                "org_name": "ALL INDIA RADIO KADAPA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013842343116251136339",
                "total_points": null,
                "row_num": 370,
                "total_users": 2,
                "org_name": "Directorate General of Quality Assurance ( DGQA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013838891397005312256",
                "total_points": null,
                "row_num": 371,
                "total_users": 7,
                "org_name": "Mahesh CBP"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013422126569889792745",
                "total_points": null,
                "row_num": 372,
                "total_users": 1,
                "org_name": "JPALtest 1"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0134900214601072649",
                "total_points": null,
                "row_num": 373,
                "total_users": 2,
                "org_name": "testmdoa"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372729081852723241",
                "total_points": null,
                "row_num": 374,
                "total_users": 177,
                "org_name": "Bharat Sanchar Nigam Limited Portal(BSNL)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013796238381080576176",
                "total_points": null,
                "row_num": 375,
                "total_users": 6,
                "org_name": "Ministry of External Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137987395462348800",
                "total_points": null,
                "row_num": 376,
                "total_users": 1,
                "org_name": "Bangalore Metro Rail Corporation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013688770184970240172",
                "total_points": null,
                "row_num": 377,
                "total_users": 1,
                "org_name": "HCSL"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0139543696241049600",
                "total_points": null,
                "row_num": 378,
                "total_users": 2,
                "org_name": "UI Development Ministry"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380153375398297612",
                "total_points": null,
                "row_num": 379,
                "total_users": 1,
                "org_name": "Institute of Secretariat Training and Management (ISTM)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013872038299779072190",
                "total_points": null,
                "row_num": 380,
                "total_users": 1,
                "org_name": "Ministry of Minority Affairs"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358981243515699250",
                "total_points": null,
                "row_num": 381,
                "total_users": 3,
                "org_name": "BIHAR"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01357853124168089610",
                "total_points": null,
                "row_num": 382,
                "total_users": 3,
                "org_name": "Kiru HEP CVPPPL"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01416950102613196822",
                "total_points": null,
                "row_num": 383,
                "total_users": 1,
                "org_name": "Organisation of Darren Boyle"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013738420634615808105",
                "total_points": null,
                "row_num": 384,
                "total_users": 1,
                "org_name": "BHAKRA BEAS MANAGEMENT BOARD"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0137979945707847684",
                "total_points": null,
                "row_num": 385,
                "total_users": 1,
                "org_name": "Licensing Finance Assessment"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013876369380597760119",
                "total_points": null,
                "row_num": 386,
                "total_users": 1,
                "org_name": "Ministry of Women and Child Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358993635114188855",
                "total_points": null,
                "row_num": 387,
                "total_users": 8,
                "org_name": "KARNATAKA"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01376168567812915238",
                "total_points": null,
                "row_num": 388,
                "total_users": 4,
                "org_name": "Assam Rifles"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379928317504716825",
                "total_points": null,
                "row_num": 389,
                "total_users": 1,
                "org_name": "Ministry of Micro Small and Medium Enterprises"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135806517433139202",
                "total_points": null,
                "row_num": 390,
                "total_users": 2,
                "org_name": "NTPC LTD"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138141945081774083",
                "total_points": null,
                "row_num": 391,
                "total_users": 1,
                "org_name": "Hindustan Aeronautics Limited (HAL)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0135806667844157448",
                "total_points": null,
                "row_num": 392,
                "total_users": 1,
                "org_name": "Home Coordination cell"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0141255393750466568",
                "total_points": null,
                "row_num": 393,
                "total_users": 1,
                "org_name": "TarentoDepartment"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013875804045262848103",
                "total_points": null,
                "row_num": 394,
                "total_users": 1,
                "org_name": "Lal Bahadur Shastri National Academy of Administration (LBSNAA)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013704368151273472219",
                "total_points": null,
                "row_num": 395,
                "total_users": 2,
                "org_name": "South Campus Library"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013811399621681152122",
                "total_points": null,
                "row_num": 396,
                "total_users": 2,
                "org_name": "Mumbai Port Trust"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013846128791756800122",
                "total_points": null,
                "row_num": 397,
                "total_users": 1,
                "org_name": "Central Police Organisation"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013682563489357824113",
                "total_points": null,
                "row_num": 398,
                "total_users": 2,
                "org_name": "DG Armed Forces Medical Service"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01372421552310681621",
                "total_points": null,
                "row_num": 399,
                "total_users": 1,
                "org_name": "Lok Sabha Secretariat"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01374897086915379215",
                "total_points": null,
                "row_num": 400,
                "total_users": 6,
                "org_name": "Northern Regional Power Committee Ministry of Power"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138185088774881289",
                "total_points": null,
                "row_num": 401,
                "total_users": 2,
                "org_name": "CSIR Central Institute of Mining Fuel Research"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01379306160361472052",
                "total_points": null,
                "row_num": 402,
                "total_users": 1,
                "org_name": "Karnataka state"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385115674601881660",
                "total_points": null,
                "row_num": 403,
                "total_users": 1,
                "org_name": "Department of Defence Research & Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01359132123730739281",
                "total_points": null,
                "row_num": 404,
                "total_users": 16,
                "org_name": "Ministry of Power"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013837481425641472188",
                "total_points": null,
                "row_num": 405,
                "total_users": 6,
                "org_name": "Telaagana Ministry"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013645046371606528327",
                "total_points": null,
                "row_num": 406,
                "total_users": 1,
                "org_name": "National Test House"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01354667993206784045",
                "total_points": null,
                "row_num": 407,
                "total_users": 1,
                "org_name": "igotTes"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013826300235235328155",
                "total_points": null,
                "row_num": 408,
                "total_users": 1,
                "org_name": "Oo Deputy Director General Sikkim WB LSA DoT Ga"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013634309638332416187",
                "total_points": null,
                "row_num": 409,
                "total_users": 1,
                "org_name": "Organisation of IGOT"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013827565830537216583",
                "total_points": null,
                "row_num": 410,
                "total_users": 3,
                "org_name": "Indian Coast Guard"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01385813977602457634",
                "total_points": null,
                "row_num": 411,
                "total_users": 5,
                "org_name": "Department two"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866570357047296290",
                "total_points": null,
                "row_num": 412,
                "total_users": 1,
                "org_name": "Minister for New Delhi"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013870800352509952165",
                "total_points": null,
                "row_num": 413,
                "total_users": 1,
                "org_name": "Ministry of Urban Development"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "0138034834265128961",
                "total_points": null,
                "row_num": 414,
                "total_users": 1,
                "org_name": "Mahanagar telephone nigam limited(MTNL)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013422066455224320742",
                "total_points": null,
                "row_num": 415,
                "total_users": 1,
                "org_name": "commercetestedited"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013866623533744128310",
                "total_points": null,
                "row_num": 416,
                "total_users": 3,
                "org_name": "Ministry for Testing"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01360689582162739276",
                "total_points": null,
                "row_num": 417,
                "total_users": 3,
                "org_name": "Department of Personnel and Training"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "013712276713988096240",
                "total_points": null,
                "row_num": 418,
                "total_users": 6,
                "org_name": "Central Board of Excise and Customs (CBEC)"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01380172700939059233",
                "total_points": null,
                "row_num": 419,
                "total_users": 1,
                "org_name": "Abcdee"
            },
            {
                "is_state": true,
                "size": "XS",
                "last_credit_date": null,
                "org_id": "01358632512033587228",
                "total_points": null,
                "row_num": 420,
                "total_users": 2,
                "org_name": "Delhi District Courts"
            }
        ]
    }
        this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
      }
    }, _error => {})
  }

  getFilteredData(response: any) {
    if (response && response.length > 0) {
      let filtered = response.filter((user: any) => user.size === this.currentPill)

      // When tabs are present, filter by is_state: State tab → true, Center tab → false
      if (this.hasTabs && this.activeTopTab?.title) {
        const isStateTab = this.activeTopTab.title.toLowerCase() === 'state'
        filtered = filtered.filter((user: any) => !!user.is_state === isStateTab)
      }

      return filtered.map(user => ({ ...user, children: [], selected: false })).slice(0, 5)
    }
    return []
  }

  /** Switch top-level tab (Center / State) */
  selectTopTab(index: number) {
    if (!this.hasTabs || index === this.activeTopTabIndex) {
      return
    }
    this.activeTopTabIndex = index
    this.activeTopTab = this.object.tabs[index]
    this.currentPill = this.activeTopTab.options?.[0]?.value || this.currentPill
    this.searchTerm = ''
    this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
    this.tabClicked.emit({ topTab: this.activeTopTab.title, sizePill: this.currentPill })
  }

  /** Returns the options for the currently active tab (or object.options for legacy) */
  get activeOptions(): any[] {
    if (this.hasTabs && this.activeTopTab?.options?.length) {
      return this.activeTopTab.options
    }
    return this.object?.options || []
  }

  getPillData(name: any) {
    this.currentPill = name
    this.searchTerm = ''
    this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
    let nameStr: any = ''
    const opts = this.activeOptions
    if (opts && opts.length > 0) {
      const found = opts.find((option: any) => option.value === name)
      nameStr = found ? found.label : name
    } else {
      switch (name) {
        case 'XL': nameStr = 'greater-than-50K'; break
        case 'L': nameStr = '10K-50K'; break
        case 'M': nameStr = '1K-10K'; break
        case 'S': nameStr = '500-1K'; break
        default: nameStr = 'less-than-500'; break
      }
    }
    this.tabClicked.emit(nameStr)
  }

  getRank(rank: number) {
    return [1, 2, 3].includes(rank) ? `rank${rank}` : 'rank0'
  }

  getMedal(rank: number) {
    if (rank === 1) {
      return 'assets/images/national-learning/Medal1.svg'
    } else if (rank === 2) {
      return 'assets/images/national-learning/Medal2.svg'
    } else {
      return 'assets/images/national-learning/Medal3.svg'
    }
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
      this.searchTerm = e.target.value
      const searchVal = e.target.value.toLowerCase()
      let data = (this.result.mdoLeaderBoard || [])
        .filter(user => user.size === this.currentPill &&
          (user.org_name || user.orgName || '').toLowerCase().includes(searchVal))

      if (this.hasTabs && this.activeTopTab?.title) {
        const isStateTab = this.activeTopTab.title.toLowerCase() === 'state'
        data = data.filter(user => !!user.is_state === isStateTab)
      }

      this.filteredData = data.map(user => ({ ...user, children: [] })).slice(0, 5)
    } else {
      this.filteredData = this.getFilteredData(this.result.mdoLeaderBoard || [])
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

  scrollToRight() {
    this.scrollableContent.nativeElement.scrollBy({ left: 200, behavior: 'smooth' })
    this.disableLeft = false
    this.disableRight = true
  }

  scrollToLeft() {
    this.scrollableContent.nativeElement.scrollBy({ left: -200, behavior: 'smooth' })
    this.disableLeft = true
    this.disableRight = false
  }

  onEdit() {
    const eventData = {
      source: 'mdoLeaderboard',
      action: 'edit',
      data: {
        fieldName: 'mdoLeaderboardConfig',
        displayName: 'MDO Leaderboard Configuration',
        value: this.object,
        fieldType: 'mdoLeaderboardConfig'
      }
    }

    if (this.eventCallback && typeof this.eventCallback === 'function') {
      this.eventCallback(eventData)
      return
    }

    if ((window as any).__INJECTOR_DATA?.eventCallback) {
      (window as any).__INJECTOR_DATA.eventCallback(eventData)
    }
  }
}
