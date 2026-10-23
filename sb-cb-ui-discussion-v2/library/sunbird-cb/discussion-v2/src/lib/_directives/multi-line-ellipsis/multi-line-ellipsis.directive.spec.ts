import { ElementRef } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MultiLineEllipsisDirective } from './multi-line-ellipsis.directive';

describe('MultiLineEllipsisDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = new ElementRef(document.createElement('div'));
    const mockTooltip = { disabled: false, show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') } as unknown as MatTooltip;
    const directive = new MultiLineEllipsisDirective(mockElementRef, mockTooltip);
    expect(directive).toBeTruthy();
  });
});
