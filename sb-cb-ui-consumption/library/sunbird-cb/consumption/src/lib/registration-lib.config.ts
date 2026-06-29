import { NsWidgetResolver } from '@sunbird-cb/resolver-v2'
import { ROOT_WIDGET_CONFIG } from './consumption.config'
// Components
import { CardsComponent } from './_common/cards/cards.component'
import { CardsModule } from './_common/cards/cards.module'
import { EventCardV2Component } from './_common/events/event-card-v2/event-card-v2.component'
import { EventCardV2Module } from './_common/events/event-card-v2/event-card-v2.module'
import { BtnFeatureV2Component } from './_common/left_nav_bar/components/btn-feature-v2/btn-feature-v2.component'
import { BtnProfileV2Component } from './_common/btn-profile-v2/btn-profile-v2.component'


export const WIDGET_REGISTERED_LIB_MODULES = [
  CardsModule,
  EventCardV2Module
]


export const WIDGET_REGISTRATION_LIB_CONFIG: NsWidgetResolver.IRegistrationConfig[] = [
  {
    widgetType: ROOT_WIDGET_CONFIG.card._type,
    widgetSubType: ROOT_WIDGET_CONFIG.card.cardResource,
    component: CardsComponent,
  },
  {
    widgetType: ROOT_WIDGET_CONFIG.card._type,
    widgetSubType: ROOT_WIDGET_CONFIG.card.eventCardLib,
    component: EventCardV2Component,
  },
  {
    widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
    widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
    component: BtnFeatureV2Component,
  },
  {
    widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
    widgetSubType: ROOT_WIDGET_CONFIG.actionButton.newProfile,
    component: BtnProfileV2Component,
  },
]
