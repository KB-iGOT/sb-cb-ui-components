// fetchCbpPlanListV3 exists in sb-cb-ui-consumption source but not in the pinned
// @sunbird-cb/consumption release yet; remove once that package is bumped.
import { Observable } from 'rxjs'

declare module '@sunbird-cb/consumption' {
  interface WidgetUserServiceLib {
    fetchCbpPlanListV3(planYear?: string, forceRefresh?: boolean, enrichment?: boolean): Observable<any[]>
  }
}
