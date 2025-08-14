import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

export default class StripHtmlOnPastePlugin extends Plugin {
  init() {
    const editor = this.editor

    editor.editing.view.document.on('clipboardInput', (_evt, data) => {
      const html = data.dataTransfer.getData('text/html') || ''
      const plainText = data.dataTransfer.getData('text/plain') || ''

      const safeHtml = this.removeJsDangerousContent(html || plainText)
      const viewFragment = editor.data.htmlProcessor.toView(safeHtml)

      data.content = viewFragment
    })
  }

  removeJsDangerousContent(html: string): string {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/ on\w+="[^"]*"/gi, '')
      .replace(/ on\w+='[^']*'/gi, '')
      .replace(/ on\w+=\w+/gi, '')
      .replace(/href=["']javascript:[^"']*["']/gi, 'href="#"')
      .replace(/src=["']javascript:[^"']*["']/gi, '')
  }
}