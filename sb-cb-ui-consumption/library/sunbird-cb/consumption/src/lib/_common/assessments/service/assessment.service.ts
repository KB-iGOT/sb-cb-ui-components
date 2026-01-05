import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'

const API_END_POINTS = {
  QUESTIONSET_READ: (id: any) => `apis/proxies/v8/questionset/v1/read/${id}`,
  QUESTIONSET_READ_MODE_EDIT: (id: any) => `apis/proxies/v8/questionset/v1/read/${id}?mode=edit`,
  QUESTIONSET_HIERARCHY: (id: any) => `apis/proxies/v8/questionset/v1/hierarchy/${id}`,
  QUESTIONSET_HIERARCHY_MODE_EDIT: (id: any) => `apis/proxies/v8/questionset/v1/hierarchy/${id}?mode=edit`,
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  private assessmentHierarchyData: any = {}

  constructor(
    private http: HttpClient
  ) { }

  getAssessmentHierarchyDetails(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_HIERARCHY(assessmentId)).pipe(
      map((response: any) => {
        this.assessmentHierarchyData = response.result.questionSet
        return this.assessmentHierarchyData
      })
    )
  }

  getAssessmentHierarchyData() {
    return this.assessmentHierarchyData
  }
}
