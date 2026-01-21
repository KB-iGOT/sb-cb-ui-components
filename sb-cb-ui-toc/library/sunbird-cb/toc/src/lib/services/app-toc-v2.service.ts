import { Injectable } from '@angular/core';
import { AppTocService } from './app-toc.service';
@Injectable({
  providedIn: 'root'
})
export class AppTocV2Service {

  constructor(private tocSvc: AppTocService) { }

  constructHeirarchyData(contentReadData: any): any {
    let contentHeirarchy: any = { ...contentReadData }
    let leafNodes: string[] = []
    if (contentHeirarchy['preliminaryAssessmentDetail'] && Object.keys(contentHeirarchy['preliminaryAssessmentDetail']).length > 0) {
      contentHeirarchy['children'] = []
      // Set parent reference for preliminary assessment (pre-assessment)
      contentHeirarchy['preliminaryAssessmentDetail'].parent = contentHeirarchy.identifier
      // Mark this as the pre-assessment for milestone locking logic
      contentHeirarchy['preliminaryAssessmentDetail'].isPreAssessment = true
      contentHeirarchy['children'].push(contentHeirarchy['preliminaryAssessmentDetail'])
      leafNodes.push(contentReadData?.preliminaryAssessment || contentReadData?.preliminaryAssessmentDetail?.identifier)
    }

    // Track milestone index for proper locking logic
    // All milestones are locked by default - unlocking is computed based on progress
    let milestoneIndex = 0
    contentHeirarchy['milestones_v1'].forEach((milestone: any) => {
      // All milestones are locked by default
      // M1 unlocks when pre-assessment is completed
      // M2+ unlock when previous milestone's mandatory content + assessment are completed
      const shouldBeLocked = true

      let mileStoneData: any = {
        "identifier": milestone.id,
        "description": milestone.description,
        "mimeType": "application/vnd.ekstep.content-collection",
        "duration": "3600",
        "primaryCategory": "Milestone",
        "courseCategory": "Milestone",
        "createdBy": "25311a4f-fa42-4cf7-882a-5e79198edfcb",
        "name": milestone.name,
        "contentType": "Course",
        "isLocked": shouldBeLocked,
        "milestoneIndex": milestoneIndex,
        "status": "Live",
        "leafNodes": [],
        // Pre-computed flags for performance optimization
        "isMilestone": true,
        "isCollection": true,
        "isModule": false,
        "isResource": false,
        "isLearningPathway": false,
        "parent": contentHeirarchy.identifier
      }
      mileStoneData['children'] = []
      if (milestone?.courses && milestone?.courses?.length) {
        milestone.courses.forEach((mileStoneCourse: any) => {
          // Set parent reference for courses inside milestone
          mileStoneCourse.parent = milestone.id
          if (mileStoneCourse && mileStoneCourse?.leafNodes && mileStoneCourse?.leafNodes?.length) {
            leafNodes = [...leafNodes, ...mileStoneCourse.leafNodes]
            mileStoneData['leafNodes'] = [...mileStoneData?.leafNodes, ...mileStoneCourse.leafNodes]

          }
          this.tocSvc.checkModuleWiseData(mileStoneCourse)
        })
      }
      if (milestone?.assessmentDetail) {
        // Set parent reference for assessment inside milestone
        milestone.assessmentDetail.parent = milestone.id
        leafNodes.push(milestone?.assessmentDetail?.identifier)
        mileStoneData['leafNodes'] = [...mileStoneData?.leafNodes, milestone?.assessmentDetail?.identifier]
        mileStoneData['children'].push(milestone?.assessmentDetail)
      }
      mileStoneData['children'] = [...milestone['courses'], ...mileStoneData['children']]
      mileStoneData['leafNodesCount'] = mileStoneData['leafNodes'].length
      contentHeirarchy['children'] = contentHeirarchy['children'] ? [...contentHeirarchy['children'], mileStoneData] : [mileStoneData]

      milestoneIndex++
    })
    contentHeirarchy['leafNodes'] = [...leafNodes]
    console.log('content Heirarchy', contentHeirarchy)
    return contentHeirarchy
  }


  mapContentHierarchyProgressUpdate(contentHeirarchyData: any, enrollmentListData: any) {
    console.log('=== mapContentHierarchyProgressUpdate ===')
    console.log('Content hierarchy:', contentHeirarchyData?.name, contentHeirarchyData?.identifier)
    console.log('Enrollment list data:', enrollmentListData)
    
    if (contentHeirarchyData && contentHeirarchyData.children) {
      let totalLeafNodes = 0
      let totalCompletedLeafNodes = 0

      contentHeirarchyData.children.forEach((child: any) => {
        if (child.primaryCategory === 'Milestone') {
          this.updateMilestoneProgress(child, contentHeirarchyData?.identifier, enrollmentListData)
          totalLeafNodes += child.leafNodesCount || 0
          totalCompletedLeafNodes += child.completedLeafNodesCount || 0
        } else {
          // For pre-assessment and other root-level content
          const enrollment = this.findEnrollment(enrollmentListData, contentHeirarchyData?.identifier)
          this.updateNodeProgress(child, enrollment)
          const isCompleted = child.status === 2 || child.completionStatus === 2 || child.completionPercentage === 100
          totalLeafNodes += child.leafNodesCount || 1
          totalCompletedLeafNodes += isCompleted ? (child.leafNodesCount || 1) : 0
        }
      })

      if (totalLeafNodes > 0) {
        const calculatedPercentage = Math.round((Number(totalCompletedLeafNodes) / Number(totalLeafNodes)) * 100)
        contentHeirarchyData.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
        contentHeirarchyData.completionStatus = contentHeirarchyData.completionPercentage === 100 ? 2 : (contentHeirarchyData.completionPercentage > 0 ? 1 : 0)
      }
    }
    return contentHeirarchyData
  }

  private updateMilestoneProgress(milestone: any, parentContentIdentifier: string, enrollmentListData: any) {
    let totalLeafNodes = 0
    let totalCompletedLeafNodes = 0
    let completedCourses = 0
    let totalCourses = 0

    if (milestone.children) {
      milestone.children.forEach((child: any) => {
        if (child.primaryCategory === 'Course') {
          totalCourses += 1
          this.updateCourseProgress(child, parentContentIdentifier, enrollmentListData)
          // Check both status and completionStatus for completion
          if (child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100) {
            completedCourses += 1
          }
        } else {
          // For assessments and other content, try multiple enrollment sources
          // First try parent Learning Pathway enrollment
          let enrollment = this.findEnrollment(enrollmentListData, parentContentIdentifier)
          if (!enrollment) {
            // Try milestone enrollment
            enrollment = this.findEnrollment(enrollmentListData, milestone?.identifier)
          }
          this.updateNodeProgress(child, enrollment)
        }

        const leafNodes = child.leafNodesCount || 1
        totalLeafNodes += leafNodes
        // Check both status and completionStatus for completion
        if (child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100) {
          totalCompletedLeafNodes += leafNodes
        }
      })
    }

    milestone.leafNodesCount = totalLeafNodes
    milestone.completedLeafNodesCount = totalCompletedLeafNodes
    milestone.totalCourses = totalCourses
    milestone.completedCourses = completedCourses

    if (totalLeafNodes > 0) {
      const calculatedPercentage = Math.round((totalCompletedLeafNodes / totalLeafNodes) * 100)
      milestone.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
      milestone.completionStatus = milestone.completionPercentage === 100 ? 2 : (milestone.completionPercentage > 0 ? 1 : 0)
      milestone.status = milestone.completionPercentage === 100 ? 2 : (milestone.completionPercentage > 0 ? 1 : 0)
    }
  }

  private updateNodeProgress(node: any, enrollment: any) {

    // Try both contentId and collectionId as the API response may use either field
    const nodeEnrollData = enrollment?.contentList?.find((ele: any) => 
      ele?.contentId === node.identifier || ele?.collectionId === node.identifier
    )
    console.log(`Updating node progress for ${node.identifier} (${node.name}):`, {
      hasEnrollment: !!enrollment,
      hasNodeEnrollData: !!nodeEnrollData,
      nodeEnrollData,
      currentCompletionStatus: node.completionStatus,
      currentCompletionPercentage: node.completionPercentage
    })
    
    if (enrollment && nodeEnrollData && nodeEnrollData.status < 2) {
      node.completionPercentage = nodeEnrollData.completionPercentage || nodeEnrollData.progress || 0
      node.completionStatus = nodeEnrollData.status
      node.status = nodeEnrollData.status
    } else if (enrollment && nodeEnrollData && nodeEnrollData.status === 2) {
      node.completionPercentage = 100
      node.completionStatus = 2
      node.status = 2
    } else {
      node.completionPercentage = 0
      node.completionStatus = 0
      node.status = 0
    }
    
    console.log(`Updated node progress for ${node.identifier}:`, {
      completionStatus: node.completionStatus,
      completionPercentage: node.completionPercentage,
      status: node.status
    })
  }

  private updateCourseProgress(course: any, parentContentIdentifier, enrollmentListData: any) {
    const enrollment = this.findEnrollment(enrollmentListData, course?.identifier)

    if (enrollment?.completionPercentage === 100) {
      // Enrollment shows 100% - mark course as complete
      course.completionPercentage = 100
      course.completionStatus = 2
      course.status = 2
      this.tocSvc.mapCompletionChildPercentageProgram(course)
    } else if (enrollment && enrollment.completionPercentage > 0) {
      // Enrollment has partial progress
      course.completionPercentage = enrollment.completionPercentage || 0
      course.completionStatus = 1
      course.status = 1
      // Also update children
      if (course.children && course.children.length > 0) {
        course.children.forEach((child: any) => {
          this.updateNodeProgress(child, enrollment)
        })
      }
    } else {
      if (course.children && course.children.length > 0) {
        let totalLeafNodes = course.leafNodesCount || 0
        let totalCompleted = 0

        course.children.forEach((child: any) => {
          this.updateNodeProgress(child, enrollment)
          if (child.status === 2 || child.completionStatus === 2 || child.completionPercentage === 100) {
            totalCompleted += child.leafNodesCount || 1
          }
        })

        // If it's a collection and doesn't have its own enrollment progress, calculate it
        if (!enrollment || !course.completionPercentage || course.completionPercentage === 0) {
          if (!totalLeafNodes) {
            totalLeafNodes = course.children.reduce((acc: number, curr: any) => acc + (curr.leafNodesCount || 1), 0)
          }
          if (totalLeafNodes > 0) {
            const calculatedPercentage = Math.round((totalCompleted / totalLeafNodes) * 100)
            course.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
            course.completionStatus = course.completionPercentage === 100 ? 2 : (course.completionPercentage > 0 ? 1 : 0)
            course.status = course.completionStatus
          }
        }
      }
    }
  }

  private findEnrollment(enrollmentList: any, identifier: string) {
    if (!enrollmentList || !enrollmentList.length) return null
    return enrollmentList.find((el: any) => el.collectionId === identifier || el.contentId === identifier)
  }



}

