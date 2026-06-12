import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import  _ from 'lodash'
import { SharedService } from '../../modules/shared/services/shared.service';
@Component({
  selector: 'app-edit-cbp-plan',
  templateUrl: './edit-cbp-plan.component.html',
  styleUrls: ['./edit-cbp-plan.component.scss']
})
export class EditCbpPlanComponent implements OnInit{

  selectedValue = ''
  searchText = ''
  planData:any
  competenciesCount = {total:0, behavioral:0, functional:0, domain:0}
  cbpForm: FormGroup;
  loading= false
  
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
  originalCompetencyValueArr:any = []
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
  constructor(
    public dialogRef: MatDialogRef<EditCbpPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sharedService:SharedService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.planData = data
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
    this.updateCompetencyCounts()
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
    this.competenciesCount = {total: 0, behavioral: 0, functional: 0, domain: 0};
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
      searchDesignation: ['']
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
  let cbpPlanData:any = this.sharedService.cbpPlanFinalObj;
  console.log('cbpPlanData',cbpPlanData)
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
      "sector_name":cbpPlanData?.sectors?.join(","),
      "instruction": cbpPlanData?.instruction ? cbpPlanData.instruction:'',
      "designation_name": formData?.designation_name ? formData.designation_name : '',
      "wing_division_section": formData?.wing_division_section,
      "role_responsibilities":roleResponsibilitiesArray,
      "activities": activities,
      "competencies": formData.competencies
    }
    let role_mapping_id = this.planData.id
    
    this.sharedService.updateRoleMapping(role_mapping_id,req).subscribe({
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
    if(index > -1) {
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
    console.log(' this.competenciesArray',  this.competenciesArray)
    if (type && theme && subTheme) {
      
      console.log('this.editCompetencyIndex--',this.editCompetencyIndex)
      if(this.editCompetencyIndex > -1) {
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
            const content = _.get(res, 'result.result.data', [])
            const mapped = content.map((item: any) => ({
              name: item?.designation || '',
              status: item?.status || 'Active',
            }))
  
            // total count may be present in different keys depending on API version.
            // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
            const total = _.get(res, 'result.result.totalcount', _.get(res, 'result.result.data.totalCount', _.get(res, 'result.result.totalCount', 0)))
            this.defaultSearchDesignationCount = total
  
            // If offset is zero (first page) replace backup, otherwise append + dedupe
            if (!this.masterData['designationBackup'] || reqOffset === 0) {
              this.masterData['designationBackup'] = mapped
            } else {
              const combined = (this.masterData['designationBackup'] || []).concat(mapped)
              this.masterData['designationBackup'] = _.uniqBy(combined, (it: any) => (it?.name || '').toLowerCase())
            }
  
            // If server returned no new items, mark as no-more-data to stop further scroll requests
            if (!mapped || mapped?.length === 0) {
              this.noMoreLegacyDesignations = true
            }
  
            // If we've loaded at least the total count, mark no-more-data
            if (this.defaultSearchDesignationCount && (this.masterData['designationBackup'] || []).length >= this.defaultSearchDesignationCount) {
              this.noMoreLegacyDesignations = true
            }
  
            // Ensure visible list matches the requested display count
            this.masterData['designation'] = (this.masterData['designationBackup'] || []).slice(0, this.designationListLoadCount)
            // loading flag cleared in finalize()
             this.ensureSelectedDesignationExists();
            this.checkCurrentDesignationPresent()
          },
          error: () => {
            // Stop further automatic calls on repeated errors to avoid tight loops
            // loading flag cleared in finalize()
            this.noMoreLegacyDesignations = true
            // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
          }
        })

        this.cbpForm.get('designation_name')?.setValue(
          this.planData?.designation_name || ''
        );
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
      igot_designation_name: "Principal Secretary",
      igot_designation_id: "DESG-002314",
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
      const selectedDesignations: string[] =
        this.cbpForm.get('designation_name')?.value || [];
  
      if (!Array.isArray(selectedDesignations) || !selectedDesignations.length) {
        return;
      }
  
      if (!this.masterData?.designation) {
        return;
      }
  
      selectedDesignations.forEach((selectedName: string) => {
        const exists = this.masterData.designation.some(
          (item: any) =>
            item?.name?.toLowerCase() === selectedName?.toLowerCase()
        );
  
        if (!exists) {
          const newDesignation = {
            name: selectedName,
            status: 'Active',
            id: 'custom-' + Date.now() + '-' + Math.random()
          };
  
          // Add to backup list as well
          this.masterData.designationBackup =
            this.masterData.designationBackup || [];
  
          this.masterData.designationBackup.unshift(newDesignation);
  
          // Also update visible list
          this.masterData.designation.unshift(newDesignation);
        }
      });
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
      if (opened) {
        if (!this.scrollListenerAttached) {
          this.scrollListenerAttached = true
  
          this.desigantionFilterEnable = false
          this.designationListLoadCount = this.designationDefaultLoadCount
          this.designationOffset = 0
  
          this.isLoadingMoreDesignations = true
          this.getDesignation(undefined, 0)
  
          // Clear search box once
          if (this.cbpForm.get('searchDesignation')) {
            this.cbpForm.get('searchDesignation')!.setValue('')
          }
  
          setTimeout(() => {
            const searchInput = document.querySelector('.search-input') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
            }
          }, 100)
  
          // Attach scroll listener safely
          setTimeout(() => {
            const panel = document.querySelector('.mat-select-panel.search-panel') as HTMLElement | null
            if (panel) {
              // align panel width to trigger
              try {
                const triggerEl = this.designationRef && this.designationRef.nativeElement as HTMLElement
                if (triggerEl) {
                  const rect = triggerEl.getBoundingClientRect()
                  // set width and left so panel aligns exactly below the trigger
                  panel.style.width = `${Math.round(rect.width)}px`
                  // leave left to overlay positioning but nudge if necessary
                  // compute left relative to viewport and apply to panel
                  const overlayLeft = rect.left
                  panel.style.left = `${Math.round(overlayLeft)}px`
                }
              } catch (e) {
                // ignore DOM errors in SSR or unexpected cases
              }
  
              const scrollHandler = this.onDesignationSelectScroll.bind(this)
              panel.addEventListener('scroll', scrollHandler, { passive: true })
            }
          }, 150)
        }
      } else {
        // Dropdown closed — reset scroll flag so it can reattach next time
        this.scrollListenerAttached = false
      }
    }
  
    onDesignationSelectScroll(event: any): void {
      const element = event?.target
      if (!this.desigantionFilterEnable) {
        // Check if user has scrolled to the bottom (with a small threshold)
        if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
          // Only load more if not already loading and if there are potentially more items
          if (!this.isLoadingMoreDesignations) {
            // If org uses IGOT designation taxonomy, request more from the API by increasing the limit
            if (this.masterData?.designationBackup?.length > this.masterData?.designation?.length) {
              // Local pagination: expand the sliced list
              this.isLoadingMoreDesignations = true
              this.designationListLoadCount += this.designationDefaultLoadCount
              // Update the filtered list with more items
              setTimeout(() => {
                this.masterData.designation = this.masterData?.designationBackup?.slice(0, this.designationListLoadCount)
                this.checkCurrentDesignationPresent()
                this.isLoadingMoreDesignations = false
              }, 500) // Small timeout to simulate loading and prevent multiple triggers
            } else {
              // Legacy (server) pagination: request next page if total not reached
              const loadedLegacy = (this.masterData?.designationBackup || []).length
              if (!this.noMoreLegacyDesignations && this.defaultSearchDesignationCount && loadedLegacy < this.defaultSearchDesignationCount) {
                this.isLoadingMoreDesignations = true
                this.designationOffset = (this.designationOffset || 0) + this.designationDefaultLoadCount
                // increase display count to include newly fetched items
                this.designationListLoadCount += this.designationDefaultLoadCount
                this.getDesignation(undefined, this.designationOffset)
              }
            }
          }
        }
      }
    }
  
    get searchDesignationControl(): FormControl {
      return this.cbpForm.get('searchDesignation') as FormControl;
    }


}
