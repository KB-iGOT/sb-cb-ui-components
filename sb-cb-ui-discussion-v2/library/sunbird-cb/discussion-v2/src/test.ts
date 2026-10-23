// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js'
import 'zone.js/testing'
import { getTestBed } from '@angular/core/testing'

(globalThis as any).$localize = (messageParts: TemplateStringsArray, ...expressions: any[]) =>
  messageParts.reduce((acc, part, i) => acc + part + (i < expressions.length ? expressions[i] : ''), '')
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
},
)
