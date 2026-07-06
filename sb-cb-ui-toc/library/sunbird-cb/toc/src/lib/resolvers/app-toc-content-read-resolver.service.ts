import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { NsContent } from '../_services/widget-content.model'
import { WidgetContentService } from '../_services/widget-content.service'
import { PipeContentRoutePipe } from '../_collection/_common/pipe-content-route/pipe-content-route.pipe'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { CommonMethodsService } from '@sunbird-cb/consumption'
import { Observable, of } from 'rxjs'
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { TocConfigService } from '../_services/toc-config.service'


@Injectable({
  providedIn: 'root'
})
export class AppTocContentReadResolverService
   {
  private tocConfig$: Observable<any> = this.tocConfigSvc.getTocConfig()

  constructor(
    private contentSvc: WidgetContentService,
    private routePipe: PipeContentRoutePipe,
    private router: Router,
    private commonMethodsSvc: CommonMethodsService,
    private tocConfigSvc: TocConfigService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsContent.IContent>> {
    const contentId = route.paramMap.get('id')
    if (contentId) {
      const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
      return this.tocConfig$.pipe(
        take(1),
        switchMap((tocConfig: any) => {
          const extendedReadEnabled = !!this.commonMethodsSvc.getEnabledUrl({
            apiConfig: tocConfig?.apiConfig,
            urlConfigPath: 'extendedContentRead',
            defaultUrl: 'enabled',
          })
          const contentRead$ = forPreview
            ? this.contentSvc.fetchAuthoringContent(contentId, 'read')
            : extendedReadEnabled
              ? this.contentSvc.fetchContentData(contentId)
              : this.contentSvc.fetchContent(contentId, 'detail')
          return contentRead$.pipe(
            map(data => ({ data, error: null })),
            tap((resolveData: any) => {
              resolveData.data = resolveData.data.result.content
              let currentRoute: string[] | string = window.location.href.split('/')
              currentRoute = currentRoute[currentRoute.length - 1]
              if (forPreview && currentRoute !== 'contents' && currentRoute !== 'overview') {
                this.router.navigate([
                  // tslint:disable-next-line
                  `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/overview?primaryCategory=${resolveData.data.primaryCategory}`,
                ])
              } else if (
                currentRoute === 'contents' &&
                resolveData.data &&
                !resolveData.data.children.length
              ) {
                this.router.navigate([
                  `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/overview
                  ?primaryCategory=${resolveData.data.primaryCategory}`,
                ])
              } else if (
                resolveData.data &&
                !forPreview &&
                (resolveData.data.primaryCategory === NsContent.EPrimaryCategory.CHANNEL ||
                  resolveData.data.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_BOARD)
              ) {
                const urlObj = this.routePipe.transform(resolveData.data, forPreview)
                this.router.navigate([urlObj.url], { queryParams: urlObj.queryParams })
              }
              return of({ error: null, data: resolveData.data })
            }),
            catchError((error: any) => of({ error, data: null })),
          )
        }),
      )
    }
    return of({ error: 'NO_ID', data: null })
  }
}
