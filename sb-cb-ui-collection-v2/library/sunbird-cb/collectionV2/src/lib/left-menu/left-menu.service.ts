import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LeftMenuService {
  private subject = new Subject<any>()

  sendMessage(message: string) {
      this.subject.next({ text: message })
  }

  clearMessages() {
      this.subject.next(undefined)
  }

  onMessage(): Observable<any> {
      return this.subject.asObservable()
  }

}
