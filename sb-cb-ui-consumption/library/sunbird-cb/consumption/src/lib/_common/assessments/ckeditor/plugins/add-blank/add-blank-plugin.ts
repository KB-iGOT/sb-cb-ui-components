import { ButtonView, Plugin } from 'ckeditor5'

export default class AddBlankPlugin extends Plugin {

  init() {
    const editor: any = this.editor

    editor.ui.componentFactory.add('insertBlank', (locale: any) => {
      const button = new ButtonView(locale)

      button.set({
        label: 'Add Blank',
        withText: true,
        tooltip: true,
      })

      button.on('execute', () => {
        const canAddBlank = editor.config.get('customConfig')?.canAddBlank
        if (canAddBlank && !canAddBlank()) {
          return
        }

        const viewFragment = editor.data.processor.toView('<input style="border-style:none none solid none">')
        const modelFragment = editor.data.toModel(viewFragment)

        editor.model.change(() => {
          editor.model.insertContent(modelFragment, editor.model.document.selection)
          setTimeout(() => {
            document.querySelectorAll('.html-object-embed').forEach((el: Element) => el.classList.remove('html-object-embed'))
          })
        })
      })

      return button
    })
  }
}
