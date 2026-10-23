// import 'jest-preset-angular/setup-jest'

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Angular compiles `i18n` template attributes into `$localize` tagged templates;
// @angular/localize's runtime polyfill isn't installed here, so provide a minimal stand-in.
(globalThis as any).$localize = (messageParts: TemplateStringsArray, ...expressions: any[]) =>
  messageParts.reduce((acc, part, i) => acc + part + (i < expressions.length ? expressions[i] : ''), '');
