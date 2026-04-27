import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { PeerReadOverlayComponent } from './peer-read-overlay.component';

@Injectable({ providedIn: 'root' })
export class PeerReadOverlayService {
  private compRef: ComponentRef<PeerReadOverlayComponent> | null = null

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  show(): void {
    if (this.compRef) { return }
    this.compRef = createComponent(PeerReadOverlayComponent, { environmentInjector: this.injector })
    this.appRef.attachView(this.compRef.hostView)
    document.body.appendChild(this.compRef.location.nativeElement)
  }

  hide(): void {
    if (!this.compRef) { return }
    this.appRef.detachView(this.compRef.hostView)
    this.compRef.destroy()
    this.compRef = null
  }
}
