import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import * as _ from 'lodash'
import { SharedService } from '../../modules/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-cbp-plan',
  templateUrl: './edit-cbp-plan.component.html',
  styleUrls: ['./edit-cbp-plan.component.scss']
})
export class EditCbpPlanComponent implements OnInit, OnDestroy {

  selectedValue = ''
  searchText = ''
  planData: any
  competenciesCount = { total: 0, behavioral: 0, functional: 0, domain: 0 }
  cbpForm: FormGroup;
  loading = false

  // Enhanced competency selection properties
  competenciesData: any[] = [];
  availableThemes: any[] = [];
  availableSubThemes: any[] = [];
  filteredThemes: any[] = [];
  filteredSubThemes: string[] = [];
  selectedCompetencyType = '';
  selectedTheme = '';
  selectedSubTheme = '';
  manualTheme = '';
  manualSubTheme = '';
  themeSearchText = '';
  subThemeSearchText = '';
  editDomainCompetencyFlag = false
  editCompetencyIndex = -1
  originalCompetencyValueArr: any = []
  desigantionFilterEnable = false
  isLoadingMoreDesignations = false;
  designationOffset = 0
  odcsDesignationCount = 0
  defaultSearchDesignationCount = 0
  designationListLoadCount = 50
  designationDefaultLoadCount = 50
  noMoreLegacyDesignations = false
  designationSearchText = ''
  designationInitInProgress = false
  scrollListenerAttached = false
  @ViewChild('dialogContent') dialogContent!: ElementRef;
  @ViewChild('designation', { read: ElementRef }) designationRef?: ElementRef
  masterData: any = {}
  portalData: any
  activeRowElement: any
  requestData: any
  requestRowData: any
  onDesignationSelectScrollBound =
    this.onDesignationSelectScroll.bind(this);
  searchDesignationLoadCount = 50
  constructor(
    public dialogRef: MatDialogRef<EditCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    public route: ActivatedRoute
  ) {
    if (this.sharedService.fromMdoPortal) {
      this.planData = data?.element
      this.requestRowData = data?.requestData
    } else {
      if(data?.fromLibrary) {
        this.planData = data?.element
      } else {  
        this.planData = data
      }
    }

    console.log('Received data:', data);
    // this.planData.competencies.map((competencies:any)=>{
    //   this.competenciesCount['total'] = this.competenciesCount['total'] + 1 
    //   if(competencies.type === 'Behavioral') {
    //     this.competenciesCount['behavioral'] = this.competenciesCount['behavioral'] +1
    //   }
    //   if(competencies.type === 'Functional') {
    //     this.competenciesCount['functional'] = this.competenciesCount['functional'] +1
    //   }
    //   if(competencies.type === 'Domain') {
    //     this.competenciesCount['domain'] = this.competenciesCount['domain'] +1
    //   }
    // })
  }


  ngOnInit() {
    this.loadCompetenciesData();
    this.initializeForm();
    const searchControl = this.cbpForm.get('searchDesignation');

    if (searchControl) {
      searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe((res: any) => {

          const txt = res?.toString()?.trim() ?? '';

          this.designationSearchText = txt;

          // RESET SEARCH PAGINATION
          this.searchDesignationLoadCount = 50;

          if (txt?.length) {

            this.desigantionFilterEnable = true;

            // API SEARCH ONLY
            console.log('mjsdfm')
            this.getDesignation(txt, 0);

          } else {

            this.desigantionFilterEnable = false;

            this.masterData.designation =
              (this.masterData.designationBackup || []).slice(
                0,
                this.designationDefaultLoadCount
              );

            this.designationListLoadCount =
              this.designationDefaultLoadCount;

            this.designationOffset = 0;

            this.checkCurrentDesignationPresent();
          }
        });
    }


    if (
      !this.masterData.designationBackup ||
      this.masterData.designationBackup.length === 0
    ) {
      this.getDesignationSafe();
    }
    this.updateCompetencyCounts()

    const requestId = this.route.snapshot.paramMap.get('request_id');

    console.log('requestId', requestId)
  }

  loadCompetenciesData() {
    this.sharedService.getCompetencyJson().subscribe({
      next: (data) => {
        this.competenciesData = data;
        console.log('Competencies data loaded:', this.competenciesData);
      },
      error: (error) => {
        console.error('Error loading competencies data:', error);
      }
    });
  }

  updateCompetencyCounts() {
    const comps = this.competenciesArray.value;
    this.competenciesCount = { total: 0, behavioral: 0, functional: 0, domain: 0 };
    comps.forEach(c => {
      this.competenciesCount.total++;
      if (c.type.toLowerCase() === 'behavioral') this.competenciesCount.behavioral++;
      if (c.type.toLowerCase() === 'functional') this.competenciesCount.functional++;
      if (c.type.toLowerCase() === 'domain') this.competenciesCount.domain++;
    });
  }

  initializeForm() {
    this.cbpForm = this.fb.group({
      designation_name: [this.planData?.designation_name || '', Validators.required],
      wing_division_section: [this.planData?.wing_division_section || '', Validators.required],
      role_responsibilities_text: [this.planData?.role_responsibilities?.join('\n') || ''],
      activities_text: [this.planData?.activities?.join('\n') || ''],
      competencySearchText: [''],
      competencyType: [''],
      competencyTheme: [''],
      competencySubTheme: [''],
      manualThemeInput: [''],
      manualSubThemeInput: [''],
      themeSearch: [''],
      subThemeSearch: [''],
      competencies: this.fb.array(this.planData?.competencies || []), // optional customization,
      searchDesignation: [''],
      igot_designation_id: [this.planData?.igot_designation_id || '']
    });

    if (!this.masterData['designationBackup']) {
      this.getDesignationSafe()
    }
  }

  private getDesignationSafe(): void {
    if (this.designationInitInProgress || this.isLoadingMoreDesignations) {
      return
    }
    this.designationInitInProgress = true
    this.getDesignation()
  }


  get roleResponsibilities(): FormArray {
    return this.cbpForm.get('role_responsibilities') as FormArray;
  }

  searchData() {

  }

  applyFilter() {

  }

  getCompetenciesByType(type: string): any[] {
    return (this.cbpForm?.get('competencies')?.value || []).filter(c => c.type === type);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveRoleMapping() {
    if (this.cbpForm.invalid) return;

    const formData = this.cbpForm.value;
    console.log('Submitted Data:', formData);
    let cbpPlanData: any = this.sharedService.cbpPlanFinalObj;
    console.log('cbpPlanData', cbpPlanData)
    const roleResponsibilitiesArray = this.cbpForm.value.role_responsibilities_text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
    const activities = this.cbpForm.value.activities_text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
    this.loading = true
    let req =
    {
      "sector_name": cbpPlanData?.sectors?.join(","),
      "instruction": cbpPlanData?.instruction ? cbpPlanData.instruction : '',
      "wing_division_section": formData?.wing_division_section,
      "role_responsibilities": roleResponsibilitiesArray,
      "activities": activities,
      "competencies": formData.competencies
    }
    console.log('masterData?.designation', this.masterData?.designation)

    if (formData?.igot_designation_id) {
      req["igot_designation_id"] = formData?.igot_designation_id || '',
        req["designation_name"] = formData?.designation_name ? formData.designation_name : ''
    } else {
      console.log('masterData?.designation', this.masterData?.designation)

      req["designation_name"] = formData?.designation_name ? formData.designation_name : ''
      const selectedDesignation = this.masterData?.designation?.find(
        (item: any) =>
          item?.name?.toLowerCase() === formData?.designation_name?.toLowerCase()
      );

      req["igot_designation_id"] = selectedDesignation?.igot_designation_id || '';

    }

    if (this.sharedService.fromMdoPortal) {
      req['request_id'] = this.requestRowData?.demand_id
      req['item_id'] = this.planData?.id
    }
    let role_mapping_id = this.planData.id

    this.sharedService.updateRoleMapping(role_mapping_id, req).subscribe({
      next: (res) => {
        // Success handling
        console.log('Success:', res);
        this.loading = false
        this.dialogRef.close('saved')
        this.snackBar.open('Role Mapping Saved Successfully', 'X', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        //this.successRoleMapping.emit(this.roleMappingForm)
      },
      error: (error) => {
        console.log('error', error)
        this.dialogRef.close()
        // Handle 409 Conflict here
        // alert('Conflict detected: The resource already exists or action conflicts.');
        //this.get
        // Or you can set a UI error message variable
        this.snackBar.open(error?.error?.detail, 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.loading = false
        //this.alreadyAvailableRoleMapping.emit(this.roleMappingForm)
      }
    });
  }

  cancelForm() {
    // Mark all controls as pristine and untouched without changing the values
    this.cbpForm.markAsPristine();
    this.cbpForm.markAsUntouched();
    // this.competenciesArray.value = this.originalCompetencyValueArr
    // console.log('this.competenciesArray',this.competenciesArray)
    // Also, if you want to mark all child controls (FormControls / FormArrays / FormGroups) as pristine and untouched
    this.markFormGroupPristineUntouched(this.cbpForm);
    // if(this.editCompetencyIndex > -1) {
    //   this.competenciesArray.value[this.editCompetencyIndex]['type'] = this.originalCompetencyValueArr[this.editCompetencyIndex]['type']
    //   this.competenciesArray.value[this.editCompetencyIndex]['theme'] = this.originalCompetencyValueArr[this.editCompetencyIndex]['theme']
    //   this.competenciesArray.value[this.editCompetencyIndex]['sub_theme'] = this.originalCompetencyValueArr[this.editCompetencyIndex]['sub_theme']
    // }
    this.dialogRef.close()
  }

  private markFormGroupPristineUntouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control instanceof FormControl) {
        control.markAsPristine();
        control.markAsUntouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupPristineUntouched(control);
      }
    });
  }

  get competenciesArray(): any {
    return this.cbpForm.get('competencies') as FormArray;
  }

  onCompetencyTypeChange(type: string) {
    this.selectedCompetencyType = type;
    this.selectedTheme = '';
    this.selectedSubTheme = '';
    this.manualTheme = '';
    this.manualSubTheme = '';
    this.availableThemes = [];
    this.availableSubThemes = [];
    this.filteredThemes = [];
    this.filteredSubThemes = [];
    this.themeSearchText = '';
    this.subThemeSearchText = '';

    // Reset form controls
    this.cbpForm.patchValue({
      competencyTheme: '',
      competencySubTheme: '',
      manualThemeInput: '',
      manualSubThemeInput: '',
      themeSearch: '',
      subThemeSearch: ''
    });

    if (type === 'Behavioral' || type === 'Functional') {
      // Load themes from JSON for Behavioral and Functional
      const competencyCategory = this.competenciesData.find(cat =>
        cat.name.toLowerCase() === type.toLowerCase() ||
        (type === 'Behavioral' && cat.name === 'Behavioural')
      );

      if (competencyCategory) {
        this.availableThemes = competencyCategory.competency_theme || [];
        this.filteredThemes = [...this.availableThemes];
      }
    }
    // For Domain, no themes are loaded - user will enter manually
  }

  onThemeChange(themeName: string) {
    this.selectedTheme = themeName;
    this.selectedSubTheme = '';
    this.availableSubThemes = [];
    this.filteredSubThemes = [];
    this.subThemeSearchText = '';

    this.cbpForm.patchValue({
      competencySubTheme: '',
      subThemeSearch: ''
    });

    // Find the selected theme and load its sub-themes
    const selectedThemeObj = this.availableThemes.find(theme => theme.name === themeName);
    if (selectedThemeObj) {
      this.availableSubThemes = selectedThemeObj.competency_sub_theme || [];
      this.filteredSubThemes = [...this.availableSubThemes];
    }
  }

  onSubThemeChange(subThemeName: string) {
    this.selectedSubTheme = subThemeName;
  }

  addCompetency() {
    let type = this.selectedCompetencyType;
    let theme = '';
    let subTheme = '';

    if (type === 'Domain') {
      // For Domain, use manual input
      theme = this.cbpForm.value.manualThemeInput?.trim();
      subTheme = this.cbpForm.value.manualSubThemeInput?.trim();
    } else {
      // For Behavioral/Functional, use dropdown selections
      theme = this.selectedTheme;
      subTheme = this.selectedSubTheme;
    }

    if (type && theme && subTheme) {
      const exists = this.competenciesArray.value.some(c =>
        c.theme === theme && c.sub_theme === subTheme && c.type === type
      );

      if (!exists) {
        const newComp = this.fb.group({
          type: [type],
          theme: [theme],
          sub_theme: [subTheme]
        });
        this.competenciesArray.push(newComp);
      }

      // Clear input fields after adding
      this.resetCompetencyForm();
    }

    const currentValues = this.competenciesArray.value;
    this.cbpForm.patchValue({ competencies: [...currentValues] });

    this.updateCompetencyCounts();
    this.cdRef.detectChanges();
    console.log(this.cbpForm?.get('competencies')?.value);
  }

  resetCompetencyForm() {
    this.selectedCompetencyType = '';
    this.selectedTheme = '';
    this.selectedSubTheme = '';
    this.manualTheme = '';
    this.manualSubTheme = '';
    this.availableThemes = [];
    this.availableSubThemes = [];
    this.filteredThemes = [];
    this.filteredSubThemes = [];
    this.themeSearchText = '';
    this.subThemeSearchText = '';

    this.cbpForm.patchValue({
      competencyType: '',
      competencyTheme: '',
      competencySubTheme: '',
      manualThemeInput: '',
      manualSubThemeInput: '',
      themeSearch: '',
      subThemeSearch: ''
    });
  }

  filterThemes(searchText: string) {
    this.themeSearchText = searchText;
    if (!searchText.trim()) {
      this.filteredThemes = [...this.availableThemes];
    } else {
      this.filteredThemes = this.availableThemes.filter(theme =>
        theme.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  filterSubThemes(searchText: string) {
    this.subThemeSearchText = searchText;
    if (!searchText.trim()) {
      this.filteredSubThemes = [...this.availableSubThemes];
    } else {
      this.filteredSubThemes = this.availableSubThemes.filter(subTheme =>
        subTheme.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  canAddCompetency(): boolean {
    if (!this.selectedCompetencyType) return false;

    if (this.selectedCompetencyType === 'Domain') {
      const theme = this.cbpForm.value.manualThemeInput?.trim();
      const subTheme = this.cbpForm.value.manualSubThemeInput?.trim();
      return !!(theme && subTheme);
    } else {
      return !!(this.selectedTheme && this.selectedSubTheme);
    }
  }

  deleteCompetency(comp) {
    const index = this.competenciesArray.controls.findIndex(
      control => control.value.theme === comp.theme && control.value.type === comp.type
    );

    if (index !== -1) {
      this.competenciesArray.removeAt(index);
    }
    this.updateCompetencyCounts();
    this.cdRef.detectChanges();
  }

  editCompetency(comp) {
    this.editDomainCompetencyFlag = true
    this.editCompetencyIndex = -1
    this.cbpForm.patchValue({
      competencyType: 'Domain',
      manualThemeInput: comp?.theme,
      manualSubThemeInput: comp?.sub_theme
    });
    const index = this.competenciesArray.value.findIndex(c =>
      c.theme === comp?.theme &&
      c.sub_theme === comp?.sub_theme &&
      c.type === "Domain"
    );
    if (index > -1) {
      this.editCompetencyIndex = index
    }
    this.selectedCompetencyType = 'Domain'
    setTimeout(() => {
      this.dialogContent.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 500)
  }

  cancelUpdate() {
    this.editDomainCompetencyFlag = false
    this.editCompetencyIndex = -1
    this.resetCompetencyForm()
  }

  updateCompetency() {
    let type = this.selectedCompetencyType;
    let theme = '';
    let subTheme = '';

    if (type === 'Domain') {
      // For Domain, use manual input
      theme = this.cbpForm.value.manualThemeInput?.trim();
      subTheme = this.cbpForm.value.manualSubThemeInput?.trim();
      this.originalCompetencyValueArr = JSON.parse(JSON.stringify(this.competenciesArray.value))
    }
    console.log(' this.competenciesArray', this.competenciesArray)
    if (type && theme && subTheme) {

      console.log('this.editCompetencyIndex--', this.editCompetencyIndex)
      if (this.editCompetencyIndex > -1) {
        this.competenciesArray.value[this.editCompetencyIndex]['type'] = type
        this.competenciesArray.value[this.editCompetencyIndex]['theme'] = theme
        this.competenciesArray.value[this.editCompetencyIndex]['sub_theme'] = subTheme
      }

      // if (!exists) {
      //   const newComp = this.fb.group({
      //     type: [type],
      //     theme: [theme],
      //     sub_theme: [subTheme]
      //   });
      //   this.competenciesArray.push(newComp);
      // }

      // Clear input fields after adding
      this.resetCompetencyForm();
      console.log('this.originalCompetencyValueArr', this.originalCompetencyValueArr)
    }

    const currentValues = this.competenciesArray.value;
    this.cbpForm.patchValue({ competencies: [...currentValues] });

    this.updateCompetencyCounts();
    this.cdRef.detectChanges();
    console.log(this.cbpForm?.get('competencies')?.value);
  }
  getDesignation(searchText?: string, offset?: number): void {


    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.designationOffset
    let reqLimit = this.designationDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyDesignations = false
      reqLimit = 50
    }
    const requestBody: any = {
      filterCriteriaMap: {
        status: 'Active'
      },
      requestedFields: [],
      pageNumber: pageIndex,
      pageSize: reqLimit,
    }
    if (searchText?.length) {
      requestBody['searchString'] = searchText
      // when searching, start from first page
      requestBody.pageNumber = 0
      // allow larger page for search if needed
      requestBody.pageSize = pageIndex === 0 ? 50 : this.designationListLoadCount
      // reset guard when performing a fresh search
      this.noMoreLegacyDesignations = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoreDesignations = true

    this.sharedService.searchPublicDesignation(requestBody).pipe(finalize(() => {
      this.isLoadingMoreDesignations = false
      this.designationInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {

          const content = _.get(res, 'result.result.data', []);

          const mapped = content.map((item: any) => ({
            name: item?.designation || '',
            status: item?.status || 'Active',
            igot_designation_name: item?.designation || '',
            igot_designation_id: item?.id || ''
          }));

          const total = _.get(
            res,
            'result.result.totalcount',
            _.get(
              res,
              'result.result.data.totalCount',
              _.get(res, 'result.result.totalCount', 0)
            )
          );

          this.defaultSearchDesignationCount = total;

          // =========================
          // SEARCH MODE
          // =========================

          if (searchText?.length) {

            this.masterData.designationFiltered = mapped;

            this.masterData.designation =
              this.masterData.designationFiltered.slice(
                0,
                this.searchDesignationLoadCount
              );

            this.checkCurrentDesignationPresent();

            return;
          }

          // =========================
          // NORMAL MODE
          // =========================

          if (!this.masterData['designationBackup'] || reqOffset === 0) {

            this.masterData['designationBackup'] = mapped;

          } else {

            const combined =
              (this.masterData['designationBackup'] || []).concat(mapped);

            this.masterData['designationBackup'] = _.uniqBy(
              combined,
              (it: any) => (it?.name || '').toLowerCase()
            );
          }

          this.masterData.designation =
            (this.masterData.designationBackup || []).slice(
              0,
              this.designationListLoadCount
            );

          // selected value preserve
          const designationControl =
            this.cbpForm.get('designation_name');

          if (designationControl) {

            const currentValues =
              designationControl.value || [];
            console.log('currentValues--', currentValues)
            const validValues =
              this.masterData.designationBackup.some(
                (item: any) => item?.name === currentValues
              )
            console.log(this.planData)
            if (!validValues) {
              this.cbpForm.get('designation_name')?.setValue(
                this.planData?.designation_name || ''
              );
              console.log('this.cbpForm', this.cbpForm)
            }

            console.log('currentValues', currentValues)
            console.log('validValues', validValues)

            // if (validValues.length !== currentValues.length) {
            //   designationControl.setValue(validValues);
            // }
          }

          // no more data
          if (!mapped || mapped.length === 0) {
            this.noMoreLegacyDesignations = true;
          }

          if (
            this.defaultSearchDesignationCount &&
            (this.masterData['designationBackup'] || []).length >=
            this.defaultSearchDesignationCount
          ) {
            this.noMoreLegacyDesignations = true;
          }

          this.checkCurrentDesignationPresent();
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyDesignations = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })




  }

  ensureSelectedDesignationExists() {
    const selected = this.planData?.designation_name;
    if (!selected) return;

    const exists = this.masterData['designationBackup']?.some(
      (d: any) => d.name?.toLowerCase() === selected.toLowerCase()
    );

    if (!exists) {
      const customObj = {
        name: selected,
        status: 'Active',
        igot_designation_name: this.planData?.designation_name,
        igot_designation_id: this.planData?.igot_designation_id || "DESG-002314",
      };

      // ✅ Add at TOP so it's visible immediately
      this.masterData['designationBackup'] = [
        customObj,
        ...(this.masterData['designationBackup'] || [])
      ];

      this.masterData['designation'] = [
        customObj,
        ...(this.masterData['designation'] || [])
      ];
    }
  }

  checkCurrentDesignationPresent() {
    const selectedDesignation: string =
      (this.cbpForm.get('designation_name')?.value || '').toString().trim();

    if (!selectedDesignation) return;
    if (!this.masterData?.designationBackup) return;

    const normalize = (v: string) => (v || '').trim().toLowerCase();

    const backup = [...this.masterData.designationBackup];

    const existingIndex = backup.findIndex(
      (item: any) =>
        normalize(item?.name) === normalize(selectedDesignation)
    );

    let selectedObj: any;

    // If exists → remove it and reuse
    if (existingIndex > -1) {
      selectedObj = backup.splice(existingIndex, 1)[0];
    }
    // If not exists → create new
    else {
      selectedObj = {
        name: selectedDesignation,
        status: 'Active',
        id: 'custom-' + Date.now() + '-' + Math.random(),
        igot_designation_name: selectedDesignation,
        igot_designation_id: 'custom-' + Date.now() + '-' + Math.random(),
      };
    }

    // 🔥 Move to top
    this.masterData.designationBackup = [
      selectedObj,
      ...backup
    ];

    // Also update visible list (same order logic)
    const visible = [...(this.masterData.designation || [])];

    const visibleIndex = visible.findIndex(
      (item: any) =>
        normalize(item?.name) === normalize(selectedDesignation)
    );

    if (visibleIndex > -1) {
      visible.splice(visibleIndex, 1);
    }

    this.masterData.designation = [
      selectedObj,
      ...visible
    ];

    this.cdRef.detectChanges();
  }
  onDesignationDropdownClosed(): void {
    // Keep the designation value but clear the search input
    const currentDesignation = this.cbpForm.get('designation_name')!.value
    setTimeout(() => {
      if (this.cbpForm.get('searchDesignation')) {
        this.cbpForm.get('searchDesignation')!.setValue('')
      }
      // Ensure the designation value remains selected
      if (currentDesignation) {
        const designationControl = this.cbpForm.get('designation_name');
        if (designationControl) {
          designationControl.setValue(currentDesignation)
        }
      }
    }, 100)
  }

  designationSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreDesignations) return

    this.designationSearchText = txt
    if (txt?.length) {
      this.desigantionFilterEnable = true
      this.isLoadingMoreDesignations = true
      this.getDesignation(txt, 0)
    } else if (this.masterData && this.masterData?.designationBackup) {
      this.masterData.designation = this.masterData?.designationBackup.slice(0, this.designationDefaultLoadCount)
      this.desigantionFilterEnable = false
      this.checkCurrentDesignationPresent()
    }
  }

  setupScrollListener(opened: boolean): void {

    if (!opened) {
      this.scrollListenerAttached = false;
      return;
    }

    if (this.scrollListenerAttached) return;
    this.scrollListenerAttached = true;
    this.desigantionFilterEnable = false;

    // ✅ Only reset pagination if we have no data yet
    if (!this.masterData.designationBackup?.length) {
      this.designationListLoadCount = this.designationDefaultLoadCount;
      this.designationOffset = 0;
      this.getDesignation(undefined, 0);
    } else {
      // ✅ Restore from backup without resetting offset
      this.masterData.designation = this.masterData.designationBackup.slice(
        0, this.designationListLoadCount
      );
      this.checkCurrentDesignationPresent();
    }

    // focus search input
    setTimeout(() => {

      const searchInput =
        document.querySelector('.search-input') as HTMLInputElement;

      if (searchInput) {
        searchInput.focus();
      }

    }, 200);

    // attach scroll
    setTimeout(() => {

      const panel = document.querySelector(
        '.mat-select-panel.search-panel'
      ) as HTMLElement | null;

      if (!panel) {
        return;
      }

      // REMOVE OLD LISTENER
      panel.removeEventListener(
        'scroll',
        this.onDesignationSelectScroll as any
      );

      panel.addEventListener(
        'scroll',
        this.onDesignationSelectScroll.bind(this),
        { passive: true }
      );

    }, 300);
  }

  onDesignationSelectScroll(event: any): void {

    const element = event.target;

    const atBottom =
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + 10;

    if (!atBottom || this.isLoadingMoreDesignations) {
      return;
    }

    const loaded =
      this.masterData?.designationBackup?.length || 0;

    const visible =
      this.masterData?.designation?.length || 0;

    console.log({
      loaded,
      visible,
      total: this.defaultSearchDesignationCount
    });

    /**
     * STEP 1
     * SHOW MORE FROM LOCAL CACHE
     */
    if (visible < loaded) {

      this.designationListLoadCount +=
        this.designationDefaultLoadCount;

      // IMPORTANT
      // create NEW ARRAY reference
      this.masterData = {
        ...this.masterData,
        designation: [
          ...this.masterData.designationBackup.slice(
            0,
            this.designationListLoadCount
          )
        ]
      };

      // FORCE UI UPDATE
      this.cdRef.detectChanges();

      // restore scroll position
      setTimeout(() => {
        element.scrollTop = element.scrollTop - 20;
      });

      return;
    }

    /**
     * STEP 2
     * FETCH NEXT PAGE
     */
    if (
      loaded < this.defaultSearchDesignationCount &&
      !this.noMoreLegacyDesignations
    ) {

      this.designationOffset +=
        this.designationDefaultLoadCount;

      this.getDesignation(
        this.designationSearchText || undefined,
        this.designationOffset
      );
    }
  }

  get searchDesignationControl(): FormControl {
    return this.cbpForm.get('searchDesignation') as FormControl;
  }

  clearDesignationSearch(event: Event): void {
    this.searchDesignationLoadCount = 50;
    event.stopPropagation();

    this.searchDesignationControl.setValue('');

    this.desigantionFilterEnable = false;

    this.masterData.designation =
      (this.masterData.designationBackup || []).slice(
        0,
        this.designationDefaultLoadCount
      );

    this.designationListLoadCount = this.designationDefaultLoadCount;
    this.designationOffset = 0;
  }

  ngOnDestroy(): void {

    const panel = document.querySelector(
      '.mat-mdc-select-panel'
    ) as HTMLElement;

    if (panel) {
      panel.removeEventListener(
        'scroll',
        this.onDesignationSelectScrollBound
      );
    }
  }


}
