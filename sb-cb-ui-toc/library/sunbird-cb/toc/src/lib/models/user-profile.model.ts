/**
 * User Profile Details namespace
 */
export namespace NsUserProfileDetails {
  export interface IUserProfileDetails {
    id?: string
    userId?: string
    firstName?: string
    lastName?: string
    email?: string
    mobile?: string
    dob?: string
    gender?: string
    profileDetails?: any
  }

  export interface IUserProfile {
    id?: string
    userId?: string
    profileDetails?: any
    personalDetails?: any
    professionalDetails?: any
    academics?: any
    competencies?: any
  }

  export enum EUserGender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
  }

  export enum ECategory {
    GENERAL = 'General',
    SC = 'SC',
    ST = 'ST',
    OBC = 'OBC',
    OTHER = 'Other',
  }
}
