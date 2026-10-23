// import 'jest-preset-angular/setup-jest'

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

(globalThis as any).$localize = (messageParts: TemplateStringsArray, ...expressions: any[]) =>
  messageParts.reduce((acc, part, i) => acc + part + (i < expressions.length ? expressions[i] : ''), '')

if (typeof (globalThis as any).ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class {
    observe() { /* noop */ }
    unobserve() { /* noop */ }
    disconnect() { /* noop */ }
  }
}
