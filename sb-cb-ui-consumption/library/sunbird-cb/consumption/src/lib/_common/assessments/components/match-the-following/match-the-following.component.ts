import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { ProgressiveEditorMount } from '../../service/progressive-editor-mount'

@Component({
    selector: 'sb-uic-match-the-following',
    templateUrl: './match-the-following.component.html',
    styleUrls: ['./match-the-following.component.scss'],
    standalone: false
})
export class MatchTheFollowingComponent implements OnInit, OnChanges, OnDestroy {
  @Input() options: any[] = []
  @Input() isReadOnly: boolean = false
  @Output() optionsUpdated = new EventEmitter<any[]>()
  @Output() addOptionRequest = new EventEmitter<void>()

  pairsList: any[] = []
  maxOptions: number = 7
  minOptions: number = 2
  /**
   * The editors already built, held by pair and side. Every side gets one as soon as the
   * question is opened - they are what the author types into - but they are built one per
   * task rather than together, so the accordion opens at once and the editors fill in behind
   * it instead of all fourteen of them holding the browser in a single pass.
   */
  activeEditors = new Set<string>()
  private readonly editorMount = new ProgressiveEditorMount<string>((key: string) => {
    this.activeEditors.add(key)
  })

  ngOnInit(): void {
    this.initializePairs()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && !changes['options'].firstChange && this.options && this.options.length > 0) {
      this.initializePairs()
    }
  }

  ngOnDestroy(): void {
    this.editorMount.cancel()
  }

  initializePairs(): void {
    // the editors of the question being left go with it, the new ones are queued below
    this.activeEditors.clear()
    if (this.options && this.options.length > 0) {
      this.pairsList = this.options
    } else {
      // Initialize with 2 empty pairs
      this.pairsList = [
        { id: 1, question: '', answer: '' },
        { id: 2, question: '', answer: '' }
      ]
    }
    this.queueEditors()
  }

  /** Every side of every pair, in reading order, so they appear the way they are laid out. */
  private queueEditors(): void {
    const keys: string[] = []
    this.pairsList.forEach((pair: any) => {
      keys.push(this.editorKey(pair, 'question'))
      keys.push(this.editorKey(pair, 'answer'))
    })
    this.editorMount.restart(keys)
  }

  /** The two sides of a pair are tracked apart, so opening one does not build the other. */
  private editorKey(pair: any, side: string): string {
    return `${pair ? pair.id : ''}:${side}`
  }

  isEditorActive(pair: any, side: string): boolean {
    return this.activeEditors.has(this.editorKey(pair, side))
  }

  activateEditor(pair: any, side: string): void {
    if (this.isReadOnly || !pair) {
      return
    }
    this.activeEditors.add(this.editorKey(pair, side))
  }

  onQuestionTextChange(pair: any, text: string): void {
    pair.question = text
    this.emitOptionsUpdate()
  }

  onAnswerTextChange(pair: any, text: string): void {
    pair.answer = text
    this.emitOptionsUpdate()
  }

  addPair(): void {
    if (this.canAddMorePairs()) {
      const newId = this.pairsList.length > 0 ? Math.max(...this.pairsList.map(p => p.id)) + 1 : 1
      const newPair = { id: newId, question: '', answer: '' }
      this.pairsList.push(newPair)
      // a pair added by hand is two more editors, not a question's worth, so both are built
      // straight away - the author is about to type into them
      this.activateEditor(newPair, 'question')
      this.activateEditor(newPair, 'answer')
      this.emitOptionsUpdate()
    }
  }

  removePair(index: number): void {
    if (this.pairsList.length > this.minOptions) {
      const [removed] = this.pairsList.splice(index, 1)
      // ids are handed out as `max + 1`, so removing the last pair frees its id for the next
      // one added - its keys go with it rather than opening the new pair's editors
      this.activeEditors.delete(this.editorKey(removed, 'question'))
      this.activeEditors.delete(this.editorKey(removed, 'answer'))
      this.emitOptionsUpdate()
    }
  }

  canAddMorePairs(): boolean {
    return this.pairsList.length < this.maxOptions
  }

  emitOptionsUpdate(): void {
    this.optionsUpdated.emit(this.pairsList)
  }
}
