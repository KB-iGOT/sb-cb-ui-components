import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ClassicEditor, editorConfig } from '../../ckeditor/custom-editor'
import { UploadHelperService } from '../../ckeditor/plugins/upload-helper'
import type { ChangeEvent } from '@ckeditor/ckeditor5-angular'

@Component({
  selector: 'sb-uic-assessment-rich-text',
  templateUrl: './assessment-rich-text.component.html',
  styleUrls: ['./assessment-rich-text.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class AssessmentRichTextComponent implements OnInit, OnChanges, OnDestroy {

  @Input() name: any
  @Input() specificToolBar!: any
  @Input() showAudioVideoToolBar: any = false
  @Input() ftbCount = 0
  @Input() ftbMaxCount = 0
  @Input() readOnly: boolean = false
  // Set when the editor is mounted in response to a click, so the caret lands where the user clicked.
  @Input() autoFocus: boolean = false
  @Output() getContent = new EventEmitter()
  @Output() onTouched = new EventEmitter<void>()
  @Output() ready = new EventEmitter<boolean>()
  isReady = false
  // <ckeditor> is mounted a task after this component, so the skeleton paints before Editor.create() holds the thread
  showEditor = false
  private showEditorTimer: any = null
  html = ''
  @Input() set textToBeShown(value: string) {
    this.html = value
  }
  @Input() height = 61

  readonly Editor = ClassicEditor
  editorConfig: any
  effectiveHeight = this.height

  constructor(
    private cdr: ChangeDetectorRef,
    private configSvc: ConfigurationsService,
    private uploadService: UploadHelperService,
    @Inject('environment') private environment: any,
  ) {
    this.initiateConfig()
  }

  ngOnInit(): void {
    this.showEditorTimer = setTimeout(() => {
      this.showEditorTimer = null
      this.showEditor = true
    })
  }

  ngOnDestroy(): void {
    if (this.showEditorTimer !== null) {
      clearTimeout(this.showEditorTimer)
      this.showEditorTimer = null
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['specificToolBar'] || changes['showAudioVideoToolBar'] || changes['height']
      || changes['ftbCount'] || changes['ftbMaxCount']) {
      this.initiateConfig()
    }
  }

  initiateConfig() {
    let baseUrl = ''
    if (typeof location !== 'undefined' && location.hostname === 'localhost') {
      baseUrl = 'http://localhost:3000/'
    } else {
      baseUrl = this.environment.cbpPortal
    }

    const editorMetaConfig = {
      contentCreateUrl: `${baseUrl}apis/proxies/v8/action/content/v3/create`,
      fileUploadUrl: `${baseUrl}apis/proxies/v8/upload/action/content/v3/upload/`,
      artifactUrl: `${this.environment.cbpPortal}assets/public`,
      fileRequestData: {
        request: {
          content: {
            contentType: 'Asset',
            createdBy: this.configSvc.userProfile?.userId,
            creator: this.configSvc.userProfile?.userName,
            mimeType: 'image/png',
            mediaType: 'image',
            language: ['English'],
            license: 'CC BY 4.0',
            primaryCategory: 'Asset',
          },
        },
      },
    }

    this.editorConfig = {
      ...editorConfig,
      customConfig: {
        editorMetaConfig,
        // Handed over as a function: CKEditor's watchdog deep-clones the config on every editor build and
        // leaves only functions and DOM elements alone, so a service instance here gets its HttpClient and the
        // whole root injector behind it copied each time - that copy is what made the editors slow to appear.
        getUploadService: () => this.uploadService,
        canAddBlank: () => this.specificToolBar === 'FTB' && this.ftbCount < this.ftbMaxCount,
      },
    }
    this.effectiveHeight = this.height

    if (this.specificToolBar === 'FTB') {
      this.editorConfig.toolbar = [
        'bold', 'italic', 'underline', '|',
        'subscript', 'superscript', '|',
        'numberedList', 'bulletedList', '|',
        'insertBlank', 'simpleImageUpload', 'simpleAudioUpload', 'simpleVideoUpload',
      ]
    } else if (this.specificToolBar === 'description') {
      this.editorConfig.toolbar = [
        'bold', 'italic', 'underline', '|',
        'subscript', 'superscript', '|',
        'numberedList', 'bulletedList', '|',
        'insertTable',
      ]
      this.effectiveHeight = 160
    } else if (this.specificToolBar === 'instructions') {
      this.editorConfig.toolbar = [
        'bold', 'italic', 'underline', '|',
        'subscript', 'superscript', '|',
        'numberedList', 'bulletedList',
      ]
      this.effectiveHeight = 100
    } else if (this.showAudioVideoToolBar) {
      this.editorConfig.toolbar = [
        'bold', 'italic', 'underline', '|',
        'subscript', 'superscript', '|',
        'numberedList', 'bulletedList', '|',
        'simpleImageUpload', 'simpleAudioUpload', 'simpleVideoUpload',
      ]
    } else {
      this.editorConfig.toolbar = [
        'bold', 'italic', 'underline', '|',
        'subscript', 'superscript', '|',
        'numberedList', 'bulletedList', '|',
        'simpleImageUpload',
      ]
    }
  }

  onChange(event: ChangeEvent) {
    const data = event.editor.getData()
    this.html = data
    this.getContent.emit(data)
  }

  onReady(editor: any) {
    this.isReady = true
    this.ready.emit(true)
    if (this.autoFocus && !this.readOnly) {
      // the editor was built hidden - reveal it first, focus does nothing on an element that isn't displayed
      this.cdr.detectChanges()
      editor?.focus?.()
    }
  }

}
