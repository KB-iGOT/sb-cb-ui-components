import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

interface BlankOption {
  id: number
  text: string
  blankNumber: string | null
}

@Component({
  selector: 'sb-uic-fill-up-the-blanks',
  templateUrl: './fill-up-the-blanks.component.html',
  styleUrls: ['./fill-up-the-blanks.component.scss']
})
export class FillUpTheBlanksComponent implements OnInit, OnChanges {
  @Input() options: BlankOption[] = []
  @Input() ftbCount: number = 0
  @Input() isReadOnly: boolean = false
  @Output() optionsUpdated = new EventEmitter<BlankOption[]>()

  blankList: any[] = []
  maxOptions: number = 7
  minOptions: number = 2

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initializeBlankList()
    if (this.options.length === 0) {
      this.addInitialOptions()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ftbCount']) {
      this.initializeBlankList()
    }
    // Also reinitialize if options change and we have ftbCount
    if (changes['options'] && this.ftbCount > 0) {
      this.initializeBlankList()
    }
  }

  initializeBlankList(): void {
    this.blankList = [{ name: 'None', id: 'none' }]
    if (this.ftbCount > 0) {
      for (let index = 0; index < this.ftbCount; index++) {
        this.blankList.push({ name: `Blank ${index + 1}`, id: `B${index + 1}` })
      }
    }
  }

  addInitialOptions(): void {
    // Add minimum required options
    for (let i = 0; i < this.minOptions; i++) {
      this.addOption()
    }
  }

  addOption(): void {
    if (this.options.length < this.maxOptions) {
      const newOption: BlankOption = {
        id: this.options.length + 1,
        text: '',
        blankNumber: null
      }
      this.options.push(newOption)
      this.emitUpdatedOptions()
    }
  }

  removeOption(index: number): void {
    if (this.options.length > this.minOptions) {
      this.options.splice(index, 1)
      // Update IDs
      this.options.forEach((opt, idx) => {
        opt.id = idx + 1
      })
      this.emitUpdatedOptions()
    }
  }

  onBlankSelectionChange(index: number, selectedBlank: any): void {
    // Check if this blank is already assigned to another option
    if (selectedBlank !== null) {
      const alreadyAssigned = this.options.find(
        (opt, idx) => idx !== index && opt.blankNumber === selectedBlank
      )
      if (alreadyAssigned) {
        // Reset to None
        setTimeout(() => {
          this.options[index].blankNumber = ''
        }, 0)
        // You might want to show a notification here
        this.snackBar.open('This blank is already assigned to another option.')
        this.emitUpdatedOptions()
        return
      }
    }
    this.options[index].blankNumber = selectedBlank
    this.emitUpdatedOptions()
  }

  onTextChange(index: number, text: string): void {
    this.options[index].text = text
    this.emitUpdatedOptions()
  }

  canAddMoreOptions(): boolean {
    return this.options.length < this.maxOptions
  }

  private emitUpdatedOptions(): void {
    this.optionsUpdated.emit(this.options)
  }

  getRomanNumeral(num: number): string {
    const romanNumerals: { [key: number]: string } = {
      1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v',
      6: 'vi', 7: 'vii', 8: 'viii', 9: 'ix', 10: 'x'
    }
    return romanNumerals[num] || num.toString()
  }
}
