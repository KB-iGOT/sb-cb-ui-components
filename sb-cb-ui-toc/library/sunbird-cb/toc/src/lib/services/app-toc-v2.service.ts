import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppTocV2Service {

  constructor() { }

  constructHeirarchyData(contentReadData: any): any {
     let contentHeirarchy:any = {...contentReadData}
         
      contentHeirarchy['milestones_v1'].forEach((milestone: any) => {
        let mileStoneData = {
            "identifier": milestone.id,
            "description": milestone.description,
            "mimeType": "application/vnd.ekstep.content-collection",
            "duration": "3600",
            "primaryCategory": "MileStone",
            "courseCategory": "MileStone",
            "createdBy": "25311a4f-fa42-4cf7-882a-5e79198edfcb",
            "name": milestone.name,
            "contentType": "Course",
            "isLocked": true,
            "status": "Live"
        }
        mileStoneData['children'] = []
        mileStoneData['children'].push({
                    "name": "Final Assessment R418",
                    "contextCategory": "Final Program Assessment",
                    "identifier": "do_114478073205096448118489",
                    "description": "Final Assessment R418 description",
                    "compatibilityLevel": 6,
                    "primaryCategory": "Course Assessment",
                    "mimeType": "application/vnd.sunbird.questionset",
                    "objectType": "QuestionSet",
                    "status": "Review"
                })
        mileStoneData['children'] = [...mileStoneData['children'], ...milestone['courses']]
        contentHeirarchy['children'] = contentHeirarchy['children'] ? [...contentHeirarchy['children'], mileStoneData] : [mileStoneData]
        
      })
      return contentHeirarchy 
  }
}

