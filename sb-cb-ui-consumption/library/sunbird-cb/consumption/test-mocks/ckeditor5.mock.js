// Jest CJS resolver can't follow the `ckeditor5` package's exports map (ESM-only,
// no `require` condition), so this stub replaces it for tests via moduleNameMapper.
// A Proxy hands back a fresh no-op class for any named export, so every plugin/view
// the source code imports (Plugin, ButtonView, GeneralHtmlSupport, ...) resolves to
// something `extends`-able without having to enumerate them all by hand.
class NoopPlugin {
  static get requires() {
    return []
  }
}

module.exports = new Proxy(
  { ClassicEditor: NoopPlugin },
  {
    get: (target, prop) => {
      if (!(prop in target)) {
        target[prop] = class extends NoopPlugin {}
      }
      return target[prop]
    },
  },
)
