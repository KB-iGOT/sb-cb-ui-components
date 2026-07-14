import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  List,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageUpload,
  Subscript,
  Superscript,
  GeneralHtmlSupport,
} from 'ckeditor5'

import SimpleAudioUpload from './plugins/simple-audio-upload/simple-audio-upload-plugin'
import SimpleVideoUpload from './plugins/simple-video-upload/simple-video-upload.plugin'
import SimpleImageUpload from './plugins/simple-image-upload/simple-image-upload.plugin'
import AddBlankPlugin from './plugins/add-blank/add-blank-plugin'
import PastePlugin from './plugins/paste-content/paste-content.plugin'

export const editorConfig = {
  licenseKey: 'GPL',
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    List,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageUpload,
    Subscript,
    Superscript,
    SimpleAudioUpload,
    SimpleVideoUpload,
    SimpleImageUpload,
    AddBlankPlugin,
    PastePlugin,
    GeneralHtmlSupport,
  ],
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  htmlSupport: {
    allow: [
      { name: 'audio', attributes: ['controls', 'controlslist', 'src'] },
      { name: 'video', attributes: ['controls', 'controlslist', 'src', 'width', 'height'] },
      { name: 'input', attributes: true, classes: true, styles: true },
    ],
  },
}

export { ClassicEditor }
