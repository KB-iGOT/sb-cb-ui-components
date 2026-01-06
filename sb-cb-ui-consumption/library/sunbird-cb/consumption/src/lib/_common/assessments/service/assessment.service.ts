import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'

const API_END_POINTS = {
  CREARE_ASSESSMENT: 'apis/proxies/v8/questionset/v1/create',
  UPDATE_ASSESSMENT: 'apis/proxies/v8/questionset/v1/hierarchy/update',
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

  getAssessmentHierarchyDetailsModeEdit(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_HIERARCHY_MODE_EDIT(assessmentId)).pipe(
      map((response: any) => {
        this.assessmentHierarchyData = response.result.questionSet
        return this.assessmentHierarchyData
      })
    )
  }

  getAssessmentHierarchyData() {
    return this.assessmentHierarchyData
  }

  getAssessmentReadDetails(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_READ(assessmentId)).pipe(
      map((response: any) => {
        return response.result.questionSet
      })
    )
  }

  getAssessmentReadDetailsModeEdit(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_READ_MODE_EDIT(assessmentId)).pipe(
      map((response: any) => {
        return response.result.questionSet
      })
    )
  }

  createAssessment(assessmentReqData: any) {
    return this.http.post<any>(API_END_POINTS.CREARE_ASSESSMENT, assessmentReqData).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  updateAssessment(assessmentHierarchyReqData: any) {
    return this.http.patch<any>(API_END_POINTS.UPDATE_ASSESSMENT, assessmentHierarchyReqData).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  updateAssessmentHierarchyRequest(changedData: any, identifier: string) {
    const nodesModified: any = {}

    // Determine if the identifier is root by comparing with assessmentHierarchyData
    const isRoot = this.assessmentHierarchyData && identifier === this.assessmentHierarchyData.identifier

    // Add node with changed metadata
    nodesModified[identifier] = {
      isNew: false,
      root: isRoot,
      metadata: changedData
    }

    // Create the hierarchy structure using existing hierarchy data
    const hierarchy: any = {}

    if (isRoot && this.assessmentHierarchyData) {
      // For root node, include name and existing children
      hierarchy[identifier] = {
        name: this.assessmentHierarchyData.name,
        root: true,
        children: this.assessmentHierarchyData.children?.map((child: any) => child.identifier) || []
      }

      // Add all existing children to hierarchy with their children arrays
      if (this.assessmentHierarchyData.children && this.assessmentHierarchyData.children.length > 0) {
        this.assessmentHierarchyData.children.forEach((child: any) => {
          hierarchy[child.identifier] = {
            children: child.children?.map((grandchild: any) => grandchild.identifier) || []
          }
        })
      }
    } else {
      // For children nodes
      hierarchy[identifier] = {
        root: false,
        children: []
      }
    }

    return {
      request: {
        data: {
          nodesModified: nodesModified,
          hierarchy: hierarchy
        }
      }
    }
  }

  createAssessmentHierarchyRequest(assessmentData: any, identifier?: string) {
    const nodesModified: any = {}
    const children: string[] = []

    // Calculate duration per section
    const totalDuration = assessmentData.expectedDuration || 0
    const numberOfSections = assessmentData.children?.length || 1
    const durationPerSection = Math.floor(totalDuration / numberOfSections)
    let remainingDuration = totalDuration - (durationPerSection * numberOfSections)

    // Create nodes for each section
    if (assessmentData.children && assessmentData.children.length > 0) {
      assessmentData.children.forEach((section: any, index: number) => {
        // Generate a unique ID for each section
        const sectionId = this.generateUUID()
        children.push(sectionId)

        // Determine section type based on paragraph flag
        const sectionType = section.paragraph ? 'paragraph' : 'section'
        const sectionName = section.paragraph ? `Paragraph ${String.fromCharCode(65 + index)}` : `Section ${String.fromCharCode(65 + index)}`

        // Distribute remaining duration to first sections
        const sectionDuration = durationPerSection + (remainingDuration > 0 ? 1 : 0)
        if (remainingDuration > 0) {
          remainingDuration--
        }

        nodesModified[sectionId] = {
          isNew: true,
          root: false,
          objectType: 'QuestionSet',
          metadata: {
            maxQuestions: section.totalQuestions || 0,
            mimeType: 'application/vnd.sunbird.questionset',
            minimumPassPercentage: assessmentData.minimumPassPercentage || 0,
            name: sectionName,
            primaryCategory: assessmentData.primaryCategory,
            totalQuestions: section.totalQuestions || 0,
            sectionLevelDefinition: section.sectionLevelDefinition,
            compatibilityLevel: assessmentData.compatibilityLevel === 'basic' ? 7 : 8,
            expectedDuration: sectionDuration,
            totalMarks: section.totalMarks || 0,
            sectionType: sectionType
          }
        }
      })
    }

    // Create the hierarchy structure
    const hierarchy: any = {}
    hierarchy[identifier] = {
      name: assessmentData.name,
      root: true,
      children: children
    }

    return {
      request: {
        data: {
          nodesModified: nodesModified,
          hierarchy: hierarchy
        }
      }
    }
  }

  private generateUUID(): string {
    return uuid()
  }
}