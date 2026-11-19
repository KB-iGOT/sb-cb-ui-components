import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { FormConfigService } from '@sunbird-cb/consumption'
import { defer, Observable, of } from 'rxjs'
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class TocConfigService {
  private tocConfig$?: Observable<any>

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private formConfigSvc: FormConfigService,
  ) { }

  getTocConfig(): Observable<any> {
    if (!this.tocConfig$) {
      if (this.isPublicPreviewOrCreator()) {
        // public / preview / creator routes have no auth session, so the protected
        // formsConfig API would fail — load the static toc.json from assets instead.
        this.tocConfig$ = this.fetchStaticTocConfig().pipe(shareReplay(1))
      } else {
        this.tocConfig$ = defer(() => {
          const globalConfig = (this.configSvc as any).globalConfig
          const clientVersion = (globalConfig
            && globalConfig.formClentVersion
            && globalConfig.formClentVersion['toc']) || 1.0
          // the toc form is picked on the client from the user read response, then read by id
          return this.formConfigSvc.getForm(this.configSvc.unMappedUser, 'portal', 'toc', clientVersion)
        }).pipe(
          map((response: any) => (response && response.result
            && (response.result.form && response.result.form.data || response.result.data)) || null),
          switchMap((data: any) => data ? of(data) : this.fetchStaticTocConfig()),
          catchError(() => this.fetchStaticTocConfig()),
          shareReplay(1),
        )
      }
    }
    return this.tocConfig$
  }

  // public / preview / creator (editMode) contexts are unauthenticated
  private isPublicPreviewOrCreator(): boolean {
    const href = window.location.href
    return href.includes('/public/')
      || href.includes('&preview=true')
      || href.includes('editMode=true')
  }

  private fetchStaticTocConfig(): Observable<any> {
    return this.http
      .get<any>(`${this.configSvc.sitePath}/feature/toc.json`)
      .pipe(catchError(() => of({})))
  }
}
