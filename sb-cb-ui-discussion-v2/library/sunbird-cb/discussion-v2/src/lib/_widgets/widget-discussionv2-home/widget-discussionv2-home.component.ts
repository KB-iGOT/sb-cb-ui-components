import { Component, OnInit } from '@angular/core';
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





  popularCommunities: any[] = [
    {
      name: 'DevOps Enthusiasts',
      members: '1.1K',
      posts: '10K',
      status: 'closed',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      name: 'Open Source Collaboratives',
      members: '1.1K',
      posts: '10K',
      status: 'open',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    },
    {
      name: 'Python Developers Forum',
      members: '1.1K',
      posts: '10K',
      status: 'closed',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg'
    }
  ];
  // communities: Community[] = [
  //   {
  //     id: 1,
  //     name: 'DevOps Enthusiasts',
  //     members: '1.1K',
  //     posts: '10K',
  //     status: 'closed',
  //     image: '/assets/devops.jpg',
  //     category: 'Software Development'
  //   },
  //   // Add more communities...
  // ];

  categories = [
    { name: 'Government and Public Administration', count: 8 },
    { name: 'Software Development', count: 11 },
    { name: 'Interpersonal Communication', count: 29 }
  ];
  communities = [
    {
      name: 'Civil Servants Associations',
      status: 'closed',
      members: '1.1K',
      posts: '10K',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg',
      moderator: 'MDO Name'
    },
    {
      name: 'Civil Servants Associations',
      status: 'closed',
      members: '1.1K',
      posts: '10K',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg',
      moderator: 'MDO Name'
    },
    {
      name: 'Civil Servants Associations',
      status: 'closed',
      members: '1.1K',
      posts: '10K',
      image: 'https://portal.dev.karmayogibharat.net/assets/public/content/do_11408384025512345617/artifact/do_11408384025512345617_1719218781302_assessment1719218781448.jpg',
      moderator: 'MDO Name'
    },
    // Add more communities...
  ];



 

  // getCommunityByCategory(category: string): Community[] {
  //   return this.communities.filter(c => c.category === category);
  // }
  ngOnInit(): void {
      
  }

}
