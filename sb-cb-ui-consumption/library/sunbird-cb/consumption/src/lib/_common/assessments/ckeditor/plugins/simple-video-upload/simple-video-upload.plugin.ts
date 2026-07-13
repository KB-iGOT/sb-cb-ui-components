import { ButtonView, GeneralHtmlSupport, Plugin } from 'ckeditor5'
import { LOADING_IMAGE } from '../loading-image'

const VIDEO_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm13 .5 3-2v11l-3-2V6.5z"/></svg>'

export default class SimpleVideoUpload extends Plugin {
  static get requires() {
    return [GeneralHtmlSupport]
  }

  init() {
    const editor: any = this.editor

    editor.conversion.for('editingDowncast').add((dispatcher: any) => {
      dispatcher.on('insert:htmlVideo', (_evt: any, data: any, conversionApi: any) => {
        const { writer, mapper } = conversionApi
        const viewElement = mapper.toViewElement(data.item)
        if (viewElement) {
          writer.setAttribute('contenteditable', 'false', viewElement)
        }
      }, { priority: 'low' })
    })

    editor.ui.componentFactory.add('simpleVideoUpload', (locale: any) => {
      const button = new ButtonView(locale)

      button.set({
        icon: VIDEO_ICON,
        label: 'Video',
        withText: false,
        tooltip: true,
      })

      button.on('execute', () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'video/*'
        input.click()

        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) {
            return
          }

          if (file.size > 400 * 1048576) {
            alert('File size should not be greater than 400 MB')
            return
          }

          const uploadService = editor.config.get('customConfig')?.uploadService
          const config = editor.config.get('customConfig')?.editorMetaConfig
          if (!uploadService || !config) {
            return
          }

          let loaderElement: any
          editor.model.change((writer: any) => {
            loaderElement = writer.createElement('imageBlock', { src: LOADING_IMAGE })
            editor.model.insertContent(loaderElement, editor.model.document.selection)
          })

          const url = await uploadService.uploadFile(file, config)

          editor.model.change((writer: any) => {
            writer.remove(loaderElement)

            const videoHtml = `<video controls controlslist="nodownload noplaybackrate" src="${url}" width="200" height="auto"></video>`
            const viewFragment = editor.data.processor.toView(videoHtml)
            const modelFragment = editor.data.toModel(viewFragment)
            editor.model.insertContent(modelFragment, editor.model.document.selection)
            setTimeout(() => {
              document.querySelectorAll('.html-object-embed').forEach((el: Element) => el.classList.remove('html-object-embed'))
            })
          })
        }
      })

      return button
    })
  }
}
