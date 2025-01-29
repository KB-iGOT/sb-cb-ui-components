import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserEnrollCommunityService } from '../../_services/user-enroll-community.service';
export interface Community {
  id: number;
  name: string;
  members: string;
  posts: string;
  status: 'open' | 'closed';
  image: string;
  category: string;
}

@Component({
  selector: 'd-v2-widget-discussionv2-home',
  templateUrl: './widget-discussionv2-home.component.html',
  styleUrls: ['./widget-discussionv2-home.component.scss']
})
export class WidgetDiscussionv2HomeComponent implements OnInit {

  shortCutData: any[]= [
    {
      name:"Saved Posts",
      icon:"bookmark_border",
      link:"/page/learn"
    },
    {
      name:"Posts By You",
      icon:"list_alt",
      link:""
    },
    {
      name:"Pending Request",
      icon:"update",
      link:""
    }
  ]
  trendingDiscussions = [
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      author: 'Harshit T Rao',
      time: 'Today, 10:21 AM',
      title: "What are some merits and demerits of the Dicey's Rule of Law?",
      likes: 598,
      views: 43,
      comments: 43,
      avatar: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    // Add more discussions...
  ];
  trendingTags = [
    'Discussion',
    'Analytics',
    'Life',
    'Computer Analysis',
    'Interview',
    'Policy'
  ];





 

  communities = [
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "description": "A community for created for Open AI Communities",
        "communityName": "Community test for Artificial Intelligence and Machine Learning",
        "communityTagId": "@DOPT",
        "updatedByUserId": "81d810fd-61ee-4f46-b4eb-ae039827d95a",
        "countOfPeopleJoined": 1,
        "updatedOn": "2025-01-23 09:40:54.158",
        "communityId": "efe7e66a-bdcb-4efa-a1b4-dff82471c008",
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "status": "active"
    },
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "description": "A community for created for Open AI Communities",
        "communityName": "Community Test for AI",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-23 13:23:57.887",
        "updatedByUserId": "a707c493-5d12-4ac5-ab61-228433be6edd",
        "countOfPeopleJoined": 1,
        "communityId": "a74c908f-831b-4254-90b5-5faa76c516bb",
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "status": "active"
    },
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "description": "A community for innovators hub to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-27 07:01:59.31",
        "updatedByUserId": "81d810fd-61ee-4f46-b4eb-ae039827d95a",
        "countOfPeopleJoined": 2,
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1029,
        "topicName": "Artificial Intelligence and Machine Learning",
        "communityName": "Innovators Hub",
        "communityId": "1d08a92b-07fa-41e4-8060-93a221d416e6",
        "status": "active"
    },
    {
        "createdByUserId": "Unauthorized",
        "communityAccessLevel": "public",
        "description": "A community for innovators hub to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-27 11:36:49.447",
        "updatedByUserId": "81d810fd-61ee-4f46-b4eb-ae039827d95a",
        "countOfPeopleJoined": 3,
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "posterImageUrl": "https://example.com/poster.png",
        "imageUrl": "https://example.com/community.png",
        "communityName": "Creative Minds Collective Testing",
        "communityId": "50d22ac1-2933-4fe4-b15f-3bf20c5a42df",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "communityAccessLevel": "public",
        "description": "A community f Minds of collective to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-22 14:42:21.812",
        "updatedByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "countOfPeopleJoined": -6,
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "posterImageUrl": "https://example.com/poster.png",
        "imageUrl": "https://example.com/community.png",
        "communityName": "Creative Minds of Collective Community Test",
        "communityId": "0cf19dbf-0a84-4427-b0d9-f4696881745c",
        "status": "active"
    },
    {
        "createdByUserId": "ff3b53a9-3b90-4cb9-ba7e-14960603724b",
        "subCategory": "Sub-category Test35",
        "communityAccessLevel": "public",
        "description": "A community for innovators hub to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-22 10:45:01.705",
        "updatedByUserId": "a707c493-5d12-4ac5-ab61-228433be6edd",
        "countOfPeopleJoined": 1,
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "communityCategoryId": "520",
        "posterImageUrl": "https://example.com/poster.png",
        "imageUrl": "https://example.com/community.png",
        "communityName": "Community for innovations",
        "category": "Category Test 1",
        "communityId": "df2e736b-c0fb-4fac-bde6-1c5d265215bb",
        "communitySubCategoryId": "555",
        "status": "active"
    },
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "searchTags": [
            [
                "community test for ai and ml"
            ]
        ],
        "description": "A community for created for Open AI Communities",
        "communityTagId": "@DOPT",
        "countOfPeopleJoined": 0,
        "updatedByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "updatedOn": "2025-01-22 18:50:50.812",
        "createdOn": "2025-01-22 18:50:50.812",
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1029,
        "topicName": "Artificial Intelligence and Machine Learning",
        "communityName": "Community Test for AI and ML",
        "communityId": "4921fc51-c9ba-4c34-af0e-110d75165b6e",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "communityAccessLevel": "public",
        "searchTags": [
            [
                "qantum computing reasearch community"
            ]
        ],
        "description": "A community for created for Open AI Communities",
        "communityTagId": "@DOPT",
        "countOfPeopleJoined": 0,
        "updatedByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "updatedOn": "2025-01-23 12:11:14.053",
        "createdOn": "2025-01-23 12:11:14.053",
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1037,
        "topicName": "Qantum Computing",
        "communityName": "Qantum Computing Reasearch Community",
        "communityId": "d4c61bdb-06af-4846-af0e-774fa408cffd",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "communityAccessLevel": "public",
        "description": "A community for created for Qantum Computing Community",
        "communityTagId": "@DOPT",
        "updatedByUserId": "a707c493-5d12-4ac5-ab61-228433be6edd",
        "countOfPeopleJoined": 1,
        "updatedOn": "2025-01-24 06:45:06.016",
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1037,
        "topicName": "Qantum Computing",
        "communityName": "Qantum Computing Community for innovation",
        "communityId": "a52de95e-f3ad-43c8-9c77-0c12a48ad7fa",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "subCategory": "Networking",
        "communityAccessLevel": "public",
        "description": "A community f Minds of collective to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "updatedByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "countOfPeopleJoined": 0,
        "updatedOn": "2024-12-11 13:23:03.194",
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "communityCategoryId": "cat345",
        "posterImageUrl": "https://example.com/poster.png",
        "imageUrl": "https://example.com/community.png",
        "communityName": "Creative Minds of Collective Community Edited",
        "category": "Technology",
        "communityId": "5c1aaf5e-519b-425b-92b4-c0d6844c816d",
        "communitySubCategoryId": "subcat789",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "communityAccessLevel": "public",
        "subCategory": "Networking",
        "description": "A community f Minds of collective to share and discuss ideas.",
        "communityTagId": "@DOPT",
        "countOfPeopleJoined": 0,
        "updatedByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "updatedOn": "2024-12-17 08:22:12.11",
        "createdOn": "2024-12-17 08:22:12.11",
        "orgId": "0140788510336040962",
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "communityCategoryId": "cat345",
        "posterImageUrl": "https://example.com/poster.png",
        "imageUrl": "https://example.com/community.png",
        "communityName": "Tech Innovation community",
        "category": "Technology",
        "communityId": "e6020da0-2e4d-4914-a145-7ca1c4f40f4e",
        "communitySubCategoryId": "subcat789",
        "status": "active"
    },
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "description": "A community for created for Open AI Communities",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-22 18:34:30.686",
        "updatedByUserId": "b12cc4a7-3759-4dce-82ae-aaf7d59c8647",
        "countOfPeopleJoined": 2,
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1029,
        "topicName": "Artificial Intelligence and Machine Learning",
        "communityName": "Open AI Communities",
        "communityId": "4c250079-822b-449b-b96b-a10abdd9ee58",
        "status": "active"
    },
    {
        "createdByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "communityAccessLevel": "public",
        "description": "A community for created for Open AI Communities",
        "communityTagId": "@DOPT",
        "countOfPeopleJoined": 0,
        "updatedByUserId": "c1cc5165-6a69-4b75-8a96-3afd2f9af79e",
        "updatedOn": "2025-01-22 18:36:27.838",
        "createdOn": "2025-01-22 18:36:27.838",
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1029,
        "topicName": "Artificial Intelligence and Machine Learning",
        "communityName": "Test Community for Artificial Intelligence and Machine Learning",
        "communityId": "41216c61-bf82-4925-9f30-d5921cb2ec76",
        "status": "active"
    },
    {
        "createdByUserId": "57fd815a-85eb-4354-aef5-d3642f90b876",
        "communityAccessLevel": "public",
        "description": "A community for created for Qantum Computing Community",
        "communityTagId": "@DOPT",
        "updatedOn": "2025-01-23 12:54:20.114",
        "updatedByUserId": "3ce43cbd-8195-4ea1-9e22-1c87ffaf7580",
        "countOfPeopleJoined": 2,
        "orgId": "0140788510336040962",
        "countOfPeopleLiked": 0,
        "tags": [
            "technology",
            "innovation",
            "networking"
        ],
        "topicId": 1037,
        "topicName": "Qantum Computing",
        "communityName": "Qantum Computing Community",
        "communityId": "e0d7cbbe-1333-4766-8159-32fbfc5d50eb",
        "status": "active"
    }
];






  @Output() searchText = new EventEmitter<any>();
  @Output() showAllByTopic = new EventEmitter<any>();
  @Output() cardClick = new EventEmitter<any>();


 
  constructor(private userEnrollSvc: UserEnrollCommunityService) { }
  async ngOnInit() {
      let data = await this.userEnrollSvc.getEnrollData()
      console.log(data)
  }

  onSearch(event: any): void {
    const searchValue = event.target.value;
    this.searchText.emit(searchValue);
    console.log('Search text:', searchValue);
    // Add your search logic here
  }

  showAllCommunitiesByTopic(topic: any) {
    this.showAllByTopic.emit(topic);
  }

  onCardClick(cardData: any){
    console.log(cardData)
    this.cardClick.emit(cardData);
  }

}
