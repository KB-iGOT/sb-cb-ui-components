import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'sb-uic-connection-hover-card',
  templateUrl: './connection-hover-card.component.html',
  styleUrls: ['./connection-hover-card.component.scss'],
  host: { class: 'flex flex-1' },
})
export class ConnectionHoverCardComponent implements OnInit, OnChanges {
  @Input() hoverUser!: any
  me!: NsUser.IUserProfile
  userName = ''
  useravatarName = ''

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.hoverUser) {
      this.getUseravatarName()
    }
  }

  getUseravatarName() {
    let name = 'Guest'
    console.log('this.hoverUser', this.hoverUser)
    if (this.hoverUser && !this.hoverUser.personalDetails) {
      if (this.hoverUser.firstName) {
        name = `${this.hoverUser.firstName} ${this.hoverUser.lastName}`
      } else {
        name = `${this.hoverUser.name}`
      }
    } else if (this.hoverUser && this.hoverUser.personalDetails) {
      if (this.hoverUser.personalDetails.middlename) {
        name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.middlename} ${this.hoverUser.personalDetails.surname}`
      } else if (this.hoverUser.personalDetails.firstName) {
        name = `${this.hoverUser.personalDetails.firstName} ${this.hoverUser.personalDetails.surname}`
      } else {
        name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.surname}`
      }
    }
    this.userName = name
    this.useravatarName = name
  }

  goToUserProfile() {
    this.router.navigate(['/app/person-profile', (this.hoverUser.id)])
  }
}