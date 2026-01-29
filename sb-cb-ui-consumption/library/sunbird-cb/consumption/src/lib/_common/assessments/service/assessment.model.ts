export namespace NsAssessment {

  export enum EAssessmentType {
    QUESTION_WEIGHTAGE = 'questionWeightage',
    OPTION_WEIGHTAGE = 'optionalWeightage',
    QUESTION_OPTION_WEIGHTAGE = 'questionOptionWeightage',
  }

  export enum ECompatibilityLevel {
    BASIC = 6,
    ADVANCED = 8,
  }

  export enum EAssessmentContextCategory {
    PRELIMINARY_ASSESSMENT = 'Preliminary Assessment',
    FINAL_MILESTONE_ASSESSMENT = 'Final Milestone Assessment',
  }

  export enum EAssessmentPrimaryCategory {
    FINAL_ASSESSMENT = 'Course Assessment',
    PRACTICE_QUESTION_SET = 'Practice Question Set'
  }


}