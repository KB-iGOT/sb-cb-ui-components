import { ElementRef } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { SingleLineTooltipDirective } from './single-line-tooltip.directive';

describe('SingleLineTooltipDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const mockTooltip = { disabled: false, show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') } as unknown as MatTooltip;
    const directive = new SingleLineTooltipDirective(mockElementRef, mockTooltip);
    expect(directive).toBeTruthy();
  });
});
