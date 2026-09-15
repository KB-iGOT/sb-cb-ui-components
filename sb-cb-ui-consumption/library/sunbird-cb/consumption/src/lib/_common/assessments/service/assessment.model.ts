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
    FINAL_PROGRAM_ASSESSMENT = 'Final Program Assessment',
    PRE_ENROLMENT_ASSESSMENT = 'Pre Enrolment Assessment',
  }

  export enum EAssessmentPrimaryCategory {
    FINAL_ASSESSMENT = 'Course Assessment',
    PRACTICE_QUESTION_SET = 'Practice Question Set',
    CQF_ASSESSMENT = 'CQF Assessment'
  }

  /**
   * The course category the question set is authored under. A comprehensive assessment is a
   * `Course Assessment` like any other, so the primary category cannot tell it apart — the
   * settings it hides and the ones it fixes are decided from here.
   *
   * `Comprehensive Assessment` does not exist on the content platform yet, so these are
   * still created as `Standalone Assessment`. Both are listed, and both are treated the
   * same way, so the day the backend takes the new category nothing here has to change.
   */
  export enum EAssessmentCourseCategory {
    STANDALONE_ASSESSMENT = 'Standalone Assessment',
    COMPREHENSIVE_ASSESSMENT = 'Comprehensive Assessment',
  }


}