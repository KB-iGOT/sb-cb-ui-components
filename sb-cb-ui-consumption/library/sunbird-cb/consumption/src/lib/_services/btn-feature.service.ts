import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({ providedIn: 'root' })
export class BtnFeatureService {
  private readonly http = inject(HttpClient)

  getBadgeCount(endpoint: string): Promise<number> {
    return this.http.get<number>(endpoint).toPromise()
  }
}
