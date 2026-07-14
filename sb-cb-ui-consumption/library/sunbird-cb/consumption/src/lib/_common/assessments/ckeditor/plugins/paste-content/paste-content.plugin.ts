import { Plugin } from 'ckeditor5'

export default class PastePlugin extends Plugin {
  init() {
    const editor: any = this.editor

    editor.editing.view.document.on('clipboardInput', (evt: any, data: any) => {
      const text = data.dataTransfer?.getData('text/plain')
      if (!text) {
        return
      }

      const cleaned = text
        .replace(/<(\/)?(b|strong|i|em|u|font|span|style)[^>]*>/gi, '')
        .replace(/ style="[^"]*"/g, '')

      evt.stop()

      editor.model.change((writer: any) => {
        editor.model.insertContent(writer.createText(cleaned), editor.model.document.selection)
      })
    })
  }
}
