import { ButtonView, GeneralHtmlSupport, Plugin } from 'ckeditor5'
import { LOADING_IMAGE } from '../loading-image'

const AUDIO_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11.5 2.5a.5.5 0 0 0-.8-.4L5.5 6H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.5l5.2 3.9a.5.5 0 0 0 .8-.4V2.5zM13.5 7a.5.5 0 0 1 .7 0 4 4 0 0 1 0 6 .5.5 0 0 1-.7-.7 3 3 0 0 0 0-4.6.5.5 0 0 1 0-.7zM16 5.5a.5.5 0 0 1 .7 0 7 7 0 0 1 0 9 .5.5 0 0 1-.7-.7 6 6 0 0 0 0-7.6.5.5 0 0 1 0-.7z"/></svg>'

export default class SimpleAudioUpload extends Plugin {
  static get requires() {
    return [GeneralHtmlSupport]
  }

  init() {
    const editor: any = this.editor

    editor.conversion.for('editingDowncast').add((dispatcher: any) => {
      dispatcher.on('insert:htmlAudio', (_evt: any, data: any, conversionApi: any) => {
        const { writer, mapper } = conversionApi
        const viewElement = mapper.toViewElement(data.item)
        if (viewElement) {
          writer.setAttribute('contenteditable', 'false', viewElement)
        }
      }, { priority: 'low' })
    })

    editor.ui.componentFactory.add('simpleAudioUpload', (locale: any) => {
      const button = new ButtonView(locale)

      button.set({
        icon: AUDIO_ICON,
        label: 'Audio',
        withText: false,
        tooltip: true,
      })

      button.on('execute', () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'audio/*'
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

            const audioHtml = `<audio controls controlslist="nodownload noplaybackrate" src="${url}"></audio>`
            const viewFragment = editor.data.processor.toView(audioHtml)
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
