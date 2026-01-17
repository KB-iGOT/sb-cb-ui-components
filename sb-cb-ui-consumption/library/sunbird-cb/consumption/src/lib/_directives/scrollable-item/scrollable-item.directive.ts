import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[sbUicScrollableItem]',
    standalone: false
})
export class ScrollableItemDirective {

  @Input('sbUicScrollableItem') public key: string
  constructor(private el: ElementRef<HTMLElement>) {}

  public scrollIntoView(blockValue: any) {
    this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: blockValue });
  }


}
