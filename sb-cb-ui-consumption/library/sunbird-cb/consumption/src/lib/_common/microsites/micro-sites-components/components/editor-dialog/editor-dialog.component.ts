import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

interface SliderItem {
  active: boolean
  banners: {
    l: string
    m: string
    s: string
    xl: string
    xs: string
    xxl: string
  }
  redirectUrl: string
  queryParams: any
  title: string
}

interface SliderData {
  sliders: SliderItem[]
  styleData: any
}

@Component({
  selector: 'app-editor-dialog',
  templateUrl: './editor-dialog.component.html',
  styleUrls: ['./editor-dialog.component.scss']
})
export class EditorDialogComponent implements OnInit {
  editorForm: FormGroup
  formType: string
  uploadStatus: string = '';
  isUploading: boolean = false;

  // Week Highlights specific properties

  // Slider specific properties
  sliderData: SliderData = {
    sliders: [],
    styleData: {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  };
  sliderItemForm: FormGroup
  isEditingSlider: boolean = false;
  editingIndex: number = -1;

  // Speaker specific properties
  speakerForm: FormGroup
  isEditingSpeaker: boolean = false;
  editingSpeakerIndex: number = -1;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize with field type from data
    this.formType = data.fieldType || 'text'
  }

  get keyHighlightsArray(): FormArray {
    return this.editorForm.get('keyHighlights') as FormArray
  }

  get weekHighlightsList(): FormArray {
    return this.editorForm.get('list') as FormArray
  }

  ngOnInit() {
    if (this.formType === 'keyHighlights') {
      this.initKeyHighlightsForm()
    } else {
      this.initForm()
      this.initSliderItemForm()

      // Initialize speaker form if needed
      if (this.formType === 'speakersConfig') {
        this.initSpeakerForm()
      }
    }
  }

  // Helper method to create a form group for a week highlight item
  createWeekHighlightItem(item: any = {}): FormGroup {
    return this.fb.group({
      title: [item.title || '', [Validators.required]],
      description: [item.description || '', [Validators.required]],
      videoUrl: [item.videoUrl || '', [
        Validators.required,
      ]]
    })
  }

  // Methods for week highlights management
  addWeekHighlightItem(): void {
    this.weekHighlightsList.push(this.createWeekHighlightItem())
  }

  removeWeekHighlightItem(index: number): void {
    this.weekHighlightsList.removeAt(index)
  }

  dropWeekHighlightItem(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.weekHighlightsList.controls, event.previousIndex, event.currentIndex)
    this.weekHighlightsList.updateValueAndValidity()
  }

  initForm() {
    // Create form based on field type
    switch (this.formType) {
      case 'weekHighlights':
        const weekHighlightsValue = this.data.value || {}

        // Initialize with an empty array if list doesn't exist
        const highlightsList = weekHighlightsValue.list || []

        this.editorForm = this.fb.group({
          title: [weekHighlightsValue.title || 'Week Highlights', [Validators.required]],
          list: this.fb.array(
            highlightsList.map((item: any) => this.createWeekHighlightItem(item))
          )
        })
        break
      case 'textarea':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        })
        break
      case 'color':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]]
        })
        break
      case 'image':
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        })
        break
      case 'boolean':
        this.editorForm = this.fb.group({
          value: [!!this.data.value]
        })
        break
      case 'metrics':
        const metricsValue = this.data.value || {}
        this.editorForm = this.fb.group({
          enabled: [metricsValue.enabled !== undefined ? metricsValue.enabled : true],
          background: [metricsValue.background || '#FFFFFF'],
          data: [metricsValue.data || {}]
        })
        break
      case 'topLearnersConfig':
        // Get top learners data or set defaults
        const topLearnersValue = this.data.value || {}
        this.editorForm = this.fb.group({
          enabled: [topLearnersValue.enabled !== undefined ? topLearnersValue.enabled : true],
          title: [topLearnersValue.title || 'Top Learners'],
          titleFontColor: [topLearnersValue.titleFontColor || '#000000'],
          customClass: [topLearnersValue.customClass || ''],
          cardHeight: [topLearnersValue.cardHeight || '134px'],
          cardMinHeight: [topLearnersValue.cardMinHeight || '134px'],
          hideEle: [topLearnersValue.hideEle || []],
          kpIcon: [topLearnersValue.kpIcon || '']
        })
        break
      case 'userProgressConfig':
        // Get user progress data or set defaults
        const userProgressValue = this.data.value || {}

        // Handle both direct structure and nested structure with 'data'
        const progressData = userProgressValue.data || userProgressValue

        this.editorForm = this.fb.group({
          enabled: [userProgressValue.enabled !== undefined ? userProgressValue.enabled : true],
          data: this.fb.group({
            title: [progressData.title || 'My Progress'],
            infoText: [progressData.infoText || 'User progress information'],
            infoIcon: [progressData.infoIcon || ''],
            profleDetails: [progressData.profleDetails || {}],
            hideEle: [progressData.hideEle || []],
            insights: [progressData.insights || { disable: false, data: { sliderData: { styleData: {} } } }]
          })
        })
        break
      case 'speakersConfig':
        // Get speakers data or set defaults
        const speakersValue = this.data.value || {}

        // Debug logs to check what data we're receiving
        console.log('EditorDialog - speakersConfig - received data.value:', this.data.value)

        // Handle both direct structure and nested structure with 'data'
        const speakerData = speakersValue.data || speakersValue
        console.log('EditorDialog - speakersConfig - processed speakerData:', speakerData)
        console.log('EditorDialog - speakersConfig - speaker list:', speakerData.list)

        this.editorForm = this.fb.group({
          enabled: [speakersValue.enabled !== undefined ? speakersValue.enabled : true],
          data: this.fb.group({
            title: [speakerData.title || ''], // Empty default
            infoText: [speakerData.infoText || ''], // Empty default
            infoIcon: [speakerData.infoIcon || ''],
            list: [speakerData.list || []]
          })
        })
        break
      case 'slider':
        // Initialize slider data from the input or use defaults
        if (this.data.value && this.data.value.sliders && this.data.value.styleData) {
          this.sliderData = this.data.value
        } else if (this.data.sliderData) {
          this.sliderData = this.data.sliderData
        }

        this.editorForm = this.fb.group({
          value: [this.sliderData]
        })
        break
      default:
        this.editorForm = this.fb.group({
          value: [this.data.value, [Validators.required]]
        })
    }
  }

  initKeyHighlightsForm() {
    const config = this.data.value || {}
    this.editorForm = this.fb.group({
      enabled: [config.enabled ?? true],
      backgroundColor: [config.backgroundColor ?? '#FFFFFF', [Validators.required]],
      titleMaxLength: [config.titleMaxLength ?? 200, [Validators.required, Validators.min(1)]],
      keyHighlights: this.fb.array(
        (config.content || []).map((item: any) =>
          this.fb.control(item.title, [
            Validators.required,
            Validators.maxLength(config.titleMaxLength ?? 200)
          ])
        )
      ),
      sliderData: this.fb.group({
        styleData: this.fb.group({
          borderRadius: [config.sliderData?.styleData?.borderRadius ?? '0'],
          customHeight: [config.sliderData?.styleData?.customHeight ?? '100px'],
          bannerMeta: [config.sliderData?.styleData?.bannerMeta ?? 'visible'],
          dots: [config.sliderData?.styleData?.dots ?? 'hidden'],
          arrowsPlacement: [config.sliderData?.styleData?.arrowsPlacement ?? 'middle-inline'],
          responsive: this.fb.group({
            customHeight: [config.sliderData?.styleData?.responsive?.customHeight ?? '80px'],
            bannerMetaAlign: [config.sliderData?.styleData?.responsive?.bannerMetaAlign ?? 'left'],
            navigationArrows: [config.sliderData?.styleData?.responsive?.navigationArrows ?? 'visible'],
            dots: [config.sliderData?.styleData?.responsive?.dots ?? 'hidden'],
            arrowsPlacement: [config.sliderData?.styleData?.responsive?.arrowsPlacement ?? 'middle-inline']
          })
        })
      })
    })
  }

  initSliderItemForm(item?: SliderItem) {
    this.sliderItemForm = this.fb.group({
      active: [item?.active !== undefined ? item.active : true],
      banners: this.fb.group({
        l: [item?.banners?.l || '', [Validators.required]],
        m: [item?.banners?.m || ''],
        s: [item?.banners?.s || ''],
        xl: [item?.banners?.xl || ''],
        xs: [item?.banners?.xs || ''],
        xxl: [item?.banners?.xxl || '']
      }),
      redirectUrl: [item?.redirectUrl || ''],
      queryParams: [item?.queryParams || {}],
      title: [item?.title || '']
    })
  }

  // Initialize the speaker form
  initSpeakerForm(speaker: any = {}) {
    console.log('Initializing speaker form with data:', speaker)

    // Ensure we handle undefined or null values
    const safeTitle = speaker && speaker.title !== undefined ? speaker.title : ''
    const safeDesc = speaker && speaker.description !== undefined ? speaker.description : ''
    const safeImage = speaker && speaker.profileImage !== undefined ? speaker.profileImage : ''
    const safeId = speaker && speaker.identifier !== undefined ? speaker.identifier : ''

    this.speakerForm = this.fb.group({
      title: [safeTitle, [Validators.required]],
      description: [safeDesc, [Validators.required]],
      profileImage: [safeImage],
      identifier: [safeId]
    })

    console.log('Speaker form initialized:', this.speakerForm.value)
  }

  // Helper method to safely get speakers list
  getSpeakersList(): any[] {
    try {
      if (!this.editorForm) {
        console.warn('Editor form not initialized')
        return []
      }

      const dataControl = this.editorForm.get('data')
      if (!dataControl) {
        console.warn('Data form group not found')
        return []
      }

      const listControl = dataControl.get('list')
      if (!listControl) {
        console.warn('List control not found')
        return []
      }

      const list = listControl.value

      if (!Array.isArray(list)) {
        console.warn('List is not an array:', list)
        return []
      }

      return list
    } catch (error) {
      console.error('Error getting speakers list:', error)
      return []
    }
  }

  // Methods for managing speakers
  addNewSpeaker() {
    this.isEditingSpeaker = true
    this.editingSpeakerIndex = -1
    this.initSpeakerForm()
  }

  editSpeaker(index: number) {
    try {
      console.log(`Editing speaker at index: ${index}`)

      // Get current list
      const speakersList = this.editorForm.get('data.list')?.value || []

      // Validate index
      if (index >= 0 && index < speakersList.length) {
        const speaker = speakersList[index]
        console.log('Speaker to edit:', speaker)

        // Set editing state
        this.isEditingSpeaker = true
        this.editingSpeakerIndex = index

        // Initialize form with speaker data
        this.initSpeakerForm(speaker)
      } else {
        console.warn(`Invalid speaker index: ${index}`)
      }
    } catch (error) {
      console.error('Error editing speaker:', error)
    }
  }

  removeSpeaker(index: number) {
    try {
      console.log(`Removing speaker at index: ${index}`)

      // Get current list
      let speakersList = this.editorForm.get('data.list')?.value

      // Handle case where the list might be null or undefined
      if (!Array.isArray(speakersList)) {
        console.warn('Speaker list is not an array, initializing empty array')
        speakersList = []
      } else {
        console.log(`Before removal: List has ${speakersList.length} speakers`)

        if (index >= 0 && index < speakersList.length) {
          // Remove the speaker at the specified index
          speakersList.splice(index, 1)
          console.log(`After removal: List has ${speakersList.length} speakers`)

          // Update the form control with a new array
          this.editorForm.get('data.list')?.setValue([...speakersList])
        } else {
          console.warn(`Invalid index: ${index} for list of length ${speakersList.length}`)
        }
      }
    } catch (error) {
      console.error('Error removing speaker:', error)
    }
  }

  // Method to remove all speakers
  removeAllSpeakers() {
    try {
      console.log('Removing all speakers')
      this.editorForm.get('data.list')?.setValue([])
    } catch (error) {
      console.error('Error removing all speakers:', error)
    }
  }

  saveSpeaker() {
    if (this.speakerForm.valid) {
      try {
        console.log('Saving speaker form:', this.speakerForm.value)

        // Extract speaker data from form
        const speakerData = {
          title: this.speakerForm.get('title')?.value,
          description: this.speakerForm.get('description')?.value,
          profileImage: this.speakerForm.get('profileImage')?.value,
          identifier: this.speakerForm.get('identifier')?.value
        }

        // Create a deep copy of the current speakers list
        const currentList = this.editorForm.get('data.list')?.value || []
        const speakersList = JSON.parse(JSON.stringify(currentList))

        console.log('Current speakers list:', currentList)
        console.log('Editing index:', this.editingSpeakerIndex)

        if (this.editingSpeakerIndex === -1) {
          // Add new speaker
          console.log('Adding new speaker:', speakerData)
          speakersList.push(speakerData)
        } else {
          // Update existing speaker
          console.log(`Updating speaker at index ${this.editingSpeakerIndex}:`, speakerData)
          speakersList[this.editingSpeakerIndex] = speakerData
        }

        console.log('Updated speakers list:', speakersList)

        // Update the form with the new list - use a new array reference for change detection
        this.editorForm.get('data.list')?.setValue([...speakersList])

        // Reset the speaker form
        this.cancelSpeakerEdit()
      } catch (error) {
        console.error('Error saving speaker:', error)
      }
    } else {
      console.warn('Speaker form is invalid:', this.speakerForm.errors)
    }
  }

  cancelSpeakerEdit() {
    this.isEditingSpeaker = false
    this.editingSpeakerIndex = -1
    this.speakerForm.reset()
  }

  // Handle speaker image upload
  onSpeakerImageSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.uploadSpeakerImage(file)
    }
  }

  uploadSpeakerImage(file: File) {
    this.isUploading = true
    this.uploadStatus = 'Uploading...'

    const formData = new FormData()
    formData.append('file', file)

    // Headers for image upload
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'locale': 'en',
      'org': 'dopt',
      'rootOrg': 'igot'
    })

    this.http.post<any>('http://localhost:3000/apis/proxies/v8/storage/orgStoreUpload', formData, { headers })
      .subscribe({
        next: (response) => {
          this.isUploading = false

          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            const transformedUrl = this.transformImageUrl(response.result.url)

            // Update the form with the new URL
            this.speakerForm.get('profileImage')?.setValue(transformedUrl)
            this.uploadStatus = 'Upload successful!'

            // Clear status after 3 seconds
            setTimeout(() => {
              this.uploadStatus = ''
            }, 3000)
          } else {
            this.uploadStatus = 'Upload failed. Invalid response.'
          }
        },
        error: (error) => {
          this.isUploading = false
          this.uploadStatus = 'Upload failed. Please try again.'
          console.error('Upload error:', error)
        }
      })
  }

  // General image upload methods
  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.uploadImage(file)
    }
  }

  uploadImage(file: File) {
    this.isUploading = true
    this.uploadStatus = 'Uploading...'

    const formData = new FormData()
    formData.append('file', file)

    // Headers as specified in the curl command
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'locale': 'en',
      'org': 'dopt',
      'rootOrg': 'igot'
    })

    this.http.post<any>('http://localhost:3000/apis/proxies/v8/storage/orgStoreUpload', formData, { headers })
      .subscribe({
        next: (response) => {
          this.isUploading = false

          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            const transformedUrl = this.transformImageUrl(response.result.url)

            // Update the form with the new URL
            this.editorForm.get('value')?.setValue(transformedUrl)
            this.uploadStatus = 'Upload successful!'

            // Clear status after 3 seconds
            setTimeout(() => {
              this.uploadStatus = ''
            }, 3000)
          } else {
            this.uploadStatus = 'Upload failed. Invalid response.'
          }
        },
        error: (error) => {
          this.isUploading = false
          this.uploadStatus = 'Upload failed. Please try again.'
          console.error('Upload error:', error)
        }
      })
  }

  // Slider specific methods
  onSliderClick(event: any) {
    console.log('Slider click:', event)
  }

  onSliderImageSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.uploadSliderImage(file)
    }
  }

  uploadSliderImage(file: File) {
    this.uploadStatus = 'Uploading...'

    const formData = new FormData()
    formData.append('file', file)

    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'locale': 'en',
      'org': 'dopt',
      'rootOrg': 'igot'
    })

    this.http.post<any>('http://localhost:3000/apis/proxies/v8/storage/orgStoreUpload', formData, { headers })
      .subscribe({
        next: (response) => {
          if (response.responseCode === 'OK' && response.result && response.result.url) {
            // Transform the URL
            const transformedUrl = this.transformImageUrl(response.result.url)

            // Update all banner sizes with the same URL
            const bannersControl = this.sliderItemForm.get('banners')
            if (bannersControl) {
              bannersControl.get('l')?.setValue(transformedUrl)
              bannersControl.get('m')?.setValue(transformedUrl)
              bannersControl.get('s')?.setValue(transformedUrl)
              bannersControl.get('xl')?.setValue(transformedUrl)
              bannersControl.get('xs')?.setValue(transformedUrl)
              bannersControl.get('xxl')?.setValue(transformedUrl)
            }

            this.uploadStatus = 'Upload successful!'

            // Clear status after 3 seconds
            setTimeout(() => {
              this.uploadStatus = ''
            }, 3000)
          } else {
            this.uploadStatus = 'Upload failed. Invalid response.'
          }
        },
        error: (error) => {
          this.uploadStatus = 'Upload failed. Please try again.'
          console.error('Upload error:', error)
        }
      })
  }

  addSliderItem() {
    this.isEditingSlider = true
    this.editingIndex = -1
    this.initSliderItemForm()
  }

  editSliderItem(index: number) {
    this.isEditingSlider = true
    this.editingIndex = index
    this.initSliderItemForm(this.sliderData.sliders[index])
  }

  removeSliderItem(index: number) {
    this.sliderData.sliders.splice(index, 1)
    this.updateEditorFormValue()
  }

  saveSliderItem() {
    if (this.sliderItemForm.valid) {
      const item: SliderItem = this.sliderItemForm.value

      // Ensure all banner sizes have the same URL if not already set
      const mainImageUrl = item.banners.l
      if (mainImageUrl) {
        item.banners.m = item.banners.m || mainImageUrl
        item.banners.s = item.banners.s || mainImageUrl
        item.banners.xl = item.banners.xl || mainImageUrl
        item.banners.xs = item.banners.xs || mainImageUrl
        item.banners.xxl = item.banners.xxl || mainImageUrl
      }

      // Ensure queryParams is an object
      if (!item.queryParams || typeof item.queryParams !== 'object') {
        item.queryParams = {}
      }

      if (this.editingIndex === -1) {
        // Add new item
        this.sliderData.sliders.push(item)
      } else {
        // Update existing item
        this.sliderData.sliders[this.editingIndex] = item
      }

      this.updateEditorFormValue()
      this.cancelSliderItemEdit()
    }
  }

  cancelSliderItemEdit() {
    this.isEditingSlider = false
    this.editingIndex = -1
  }

  updateEditorFormValue() {
    // Update the main form with the new slider data
    this.editorForm.get('value')?.setValue({ ...this.sliderData })
  }

  transformImageUrl(originalUrl: string): string {
    // Replace 'https://storage.googleapis.com/igotqa/' with 'https://portal.qa.karmayogibharat.net/content-store/'
    return originalUrl.replace('https://storage.googleapis.com/igotqa/', 'https://portal.qa.karmayogibharat.net/content-store/')
  }

  addKeyHighlight() {
    this.keyHighlightsArray.push(
      this.fb.control('', [
        Validators.required,
        Validators.maxLength(this.editorForm.get('titleMaxLength')?.value || 200)
      ])
    )
  }

  removeKeyHighlight(index: number) {
    this.keyHighlightsArray.removeAt(index)
  }

  dropKeyHighlight(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.keyHighlightsArray.controls, event.previousIndex, event.currentIndex)
    this.keyHighlightsArray.updateValueAndValidity()
  }

  onSubmit() {
    if (this.formType === 'keyHighlights') {
      const formValue = this.editorForm.value
      const updatedConfig = {
        enabled: formValue.enabled,
        backgroundColor: formValue.backgroundColor,
        titleMaxLength: formValue.titleMaxLength,
        content: formValue.keyHighlights.map((title: string) => ({ title })),
        sliderData: {
          styleData: formValue.sliderData.styleData
        }
      }
      this.dialogRef.close(updatedConfig)
    } else if (this.formType === 'weekHighlights') {
      if (this.editorForm.valid) {
        // Create structured data for week highlights with proper list format
        const formValue = this.editorForm.value
        const updatedConfig = {
          title: formValue.title,
          list: formValue.list
        }
        this.dialogRef.close(updatedConfig)
      }
    } else if (this.formType === 'metrics') {
      if (this.editorForm.valid) {
        // Create structured data for metrics with enabled flag
        const formValue = this.editorForm.value
        const updatedConfig = {
          enabled: formValue.enabled,
          background: formValue.background,
          data: formValue.data
        }
        this.dialogRef.close(updatedConfig)
      }
    } else if (this.formType === 'topLearnersConfig') {
      if (this.editorForm.valid) {
        // Create structured data for top learners with enabled flag
        const formValue = this.editorForm.value
        this.dialogRef.close(formValue) // Return all form values as config
      }
    } else if (this.formType === 'userProgressConfig') {
      if (this.editorForm.valid) {
        // Return structured data matching the expected format:
        // { enabled: true, data: { title, infoText, infoIcon, profleDetails, hideEle, insights } }
        const formValue = this.editorForm.value
        console.log('Submitting userProgressConfig form:', formValue)
        this.dialogRef.close(formValue) // Return the form value with enabled and nested data
      }
    } else if (this.formType === 'speakersConfig') {
      if (this.editorForm.valid) {
        try {
          console.log('Submitting speakersConfig form')

          // Get form values
          const formValue = this.editorForm.value

          // Get speakers list and create a deep copy to avoid reference issues
          const speakersList = this.getSpeakersList()
          const speakersListCopy = JSON.parse(JSON.stringify(speakersList))

          console.log('Final speakers list for submission:', speakersListCopy)

          // Return with the speakerOftheDay structure format
          const speakerConfig = {
            speakerOftheDay: {
              enabled: formValue.enabled,
              data: {
                title: formValue.data.title,
                infoText: formValue.data.infoText,
                infoIcon: formValue.data.infoIcon,
                list: speakersListCopy  // Use the deep copied list
              }
            }
          }

          console.log('Final speaker config for submission:', speakerConfig)
          this.dialogRef.close(speakerConfig)
        } catch (error) {
          console.error('Error submitting speakers form:', error)
        }
      }
    } else if (this.editorForm.valid) {
      this.dialogRef.close(this.editorForm.value.value)
    }
  }

  onCancel() {
    this.dialogRef.close()
  }

  dropSliderItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sliderData.sliders, event.previousIndex, event.currentIndex)
    this.updateEditorFormValue()
  }
}