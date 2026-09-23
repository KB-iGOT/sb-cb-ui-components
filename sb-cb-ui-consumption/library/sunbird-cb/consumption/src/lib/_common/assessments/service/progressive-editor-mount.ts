/**
 * Builds a set of rich text editors one at a time rather than all at once.
 *
 * A CKEditor instance carries the whole plugin set and is expensive to construct, and one
 * question can hold fourteen of them. Built together in a single change detection pass they
 * hold the browser long enough that the accordion looks as though it never opened. Handed to
 * this instead, each one is built in its own task, so the accordion opens straight away and
 * the editors fill in behind it with the page painted between each.
 *
 * The caller says what mounting one means - adding it to whatever set its template reads -
 * so this only owns the pacing.
 */
export class ProgressiveEditorMount<T> {

  private handle: any = null

  constructor(private readonly mountOne: (key: T) => void) { }

  /** Drops anything still queued and starts again on the keys given, in order. */
  restart(keys: T[]): void {
    this.cancel()
    const pending = (keys || []).slice()
    const mountNext = () => {
      if (!pending.length) {
        this.handle = null
        return
      }
      this.mountOne(pending.shift() as T)
      this.handle = pending.length ? setTimeout(mountNext, 0) : null
    }
    if (pending.length) {
      this.handle = setTimeout(mountNext, 0)
    }
  }

  /** Stops the queue, for a component going away or a question being replaced. */
  cancel(): void {
    if (this.handle !== null) {
      clearTimeout(this.handle)
      this.handle = null
    }
  }
}
