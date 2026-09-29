import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../modules/shared/services/shared.service';

type GapStatus = 'FULL' | 'PARTIAL' | 'NO_MATCH';

interface GapAnalysisResult {
  area: string;
  theme: string;
  subtheme: string;
  proficiencyLevel: string;
  currentLevel: string;
  requiredLevel: string;
  courseLevel: string;
  status: GapStatus;
  reason: string;
}

@Component({
  selector: 'app-gap-analysis-recommended-course',
  templateUrl: './gap-analysis-recommended-course.component.html',
  styleUrls: ['./gap-analysis-recommended-course.component.scss']
})
export class GapAnalysisRecommendedCourseComponent implements OnInit {

  @Input() planData: any;

  loading = false;
  recommended_course_id = '';
  cbpPlanData: any;

  searchText = '';
  filterdCourses: any[] = [];
  selectFilterCourses: any[] = [];

  competenciesCount = {
    total: 0,
    public_courses: 0,
    igot: 0
  };

  expandedCompetencies: { [key: string]: boolean } = {};

  // Gap results for each course, keyed by course index.
  courseGapResults: { [index: number]: GapAnalysisResult[] } = {};

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cbpPlanData = this.sharedService.cbpPlanFinalObj;

    this.sharedService.getRecommendedCourse(this.planData.id).subscribe({
      next: (res) => {
        this.recommended_course_id = res?.id || '';

        const allCourses: any[] = [];

        if (Array.isArray(res?.filtered_courses)) {
          res.filtered_courses.forEach((item: any) => {
            // Relevancy remains the initial course recommendation filter.
            // Gap analysis is performed separately using Area + Theme +
            // Subtheme + course_level.
            if (Number(item?.relevancy || 0) > 75) {
              allCourses.push(item);
            }
          });
        }

        this.filterdCourses = allCourses;

        this.updateCompetencyCounts();
        this.calculateAllCourseGaps();
        this.getUserCourse();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error?.error?.detail || 'Unable to load recommended courses.',
          'X',
          {
            duration: 3000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });
  }

  updateCompetencyCounts(): void {
    this.competenciesCount = {
      total: this.filterdCourses.length,
      public_courses: this.filterdCourses.filter(c => c?.is_public).length,
      igot: this.filterdCourses.filter(c => !c?.is_public).length
    };
  }

  getUserCourse(): void {
    const role_mapping_id = this.planData.id;

    this.loading = true;

    this.sharedService.getUserCourse(role_mapping_id).subscribe({
      next: (res) => {
        this.loading = false;

        if (Array.isArray(res) && res.length) {
          res.forEach((course: any) => {
            this.filterdCourses.push(course);
          });
        }

        this.updateCompetencyCounts();
        this.calculateAllCourseGaps();

        console.log(
          'filterdCourses after adding user courses:',
          this.filterdCourses
        );
      },
      error: (error) => {
        console.log('error', error);
        this.loading = false;
      }
    });
  }

  /**
   * Returns competencies from either competencies or competencies_v6.
   */
  getCourseCompetencies(course: any): any[] {
    if (Array.isArray(course?.competencies)) {
      return course.competencies;
    }

    if (Array.isArray(course?.competencies_v6)) {
      return course.competencies_v6;
    }

    return [];
  }

  normalize(value: any): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  /**
   * Gets the first available value from the supplied keys.
   */
  getValue(object: any, keys: string[]): any {
    if (!object) {
      return '';
    }

    for (const key of keys) {
      if (
        object[key] !== undefined &&
        object[key] !== null &&
        String(object[key]).trim() !== ''
      ) {
        return object[key];
      }
    }

    return '';
  }

  getCompetencyArea(competency: any): string {
    return this.getValue(competency, [
      'competencyAreaName',
      'area',
      'competency_area',
      'competencyArea'
    ]);
  }

  getCompetencyTheme(competency: any): string {
    return this.getValue(competency, [
      'competencyThemeName',
      'theme',
      'competency_theme',
      'competencyTheme'
    ]);
  }

  getCompetencySubtheme(competency: any): string {
    return this.getValue(competency, [
      'competencySubthemeName',
      'subtheme',
      'competency_subtheme',
      'competencySubtheme'
    ]);
  }

  getProficiencyLevel(competency: any): string {
    return this.getValue(competency, [
      'proficiency_level',
      'proficiencyLevel',
      'requiredProficiency',
      'required_proficiency',
      'currentProficiency',
      'current_proficiency'
    ]);
  }

  /**
   * IMPORTANT:
   * course_level is the authoritative STO level of a course.
   */
  getCourseLevel(course: any, competency?: any): string {
    return this.getValue(course, ['course_level']) ||
      this.getValue(competency, ['course_level']);
  }

  /**
   * Finds role competency data from planData / cbpPlanData.
   */
  getRequiredCompetencies(): any[] {
    const possibleSources = [
      this.planData?.competencies,
      this.planData?.competency,
      this.planData?.competency_data,
      this.planData?.role_competencies,
      this.planData?.competencies_v6,
      this.cbpPlanData?.competencies,
      this.cbpPlanData?.competency,
      this.cbpPlanData?.role_competencies
    ];

    for (const source of possibleSources) {
      if (Array.isArray(source) && source.length) {
        return source;
      }
    }

    return [];
  }

  getRequiredLevel(competency: any): string {
    return this.getValue(competency, [
      'requiredProficiency',
      'required_proficiency',
      'requiredLevel',
      'required_level',
      'proficiencyLevel',
      'proficiency_level',
      'level',
      'stoLevel',
      'sto_level'
    ]);
  }

  getCurrentLevel(competency: any): string {
    return this.getValue(competency, [
      'currentProficiency',
      'current_proficiency',
      'currentLevel',
      'current_level',
      'currentProficiencyLevel',
      'current_proficiency_level'
    ]);
  }

  /**
   * STO hierarchy:
   * Operational < Tactical < Strategic
   */
  getLevelRank(level: any): number {
    switch (this.normalize(level)) {
      case 'operational':
        return 1;
      case 'tactical':
        return 2;
      case 'strategic':
        return 3;
      default:
        return 0;
    }
  }

  /**
   * Match course competency to role competency using:
   * Area -> Theme -> Subtheme
   *
   * Then compare the course's course_level with the required level.
   */
  calculateCourseGaps(course: any): GapAnalysisResult[] {
    const requiredCompetencies = this.getRequiredCompetencies();

    if (!requiredCompetencies.length) {
      return [];
    }

    const courseCompetencies = this.getCourseCompetencies(course);
    const results: GapAnalysisResult[] = [];

    courseCompetencies.forEach((courseCompetency: any) => {
      const courseArea = this.normalize(
        this.getCompetencyArea(courseCompetency)
      );
      const courseTheme = this.normalize(
        this.getCompetencyTheme(courseCompetency)
      );
      const courseSubtheme = this.normalize(
        this.getCompetencySubtheme(courseCompetency)
      );

      if (!courseTheme || !courseSubtheme) {
        return;
      }

      const courseLevel = this.getCourseLevel(course, courseCompetency);

      requiredCompetencies.forEach((requiredCompetency: any) => {
      const requiredArea = this.normalize(
        this.getCompetencyArea(requiredCompetency)
      );

      const requiredTheme = this.normalize(
        this.getCompetencyTheme(requiredCompetency)
      );

      const requiredSubtheme = this.normalize(
        this.getCompetencySubtheme(requiredCompetency)
      );

      const requiredProficiencyLevel = this.normalize(
        this.getProficiencyLevel(requiredCompetency)
      );

      if (!requiredTheme || !requiredSubtheme) {
        return;
      }

      const courseProficiencyLevel = this.normalize(
        this.getProficiencyLevel(courseCompetency)
      );

      /*
      * Match:
      * Area + Theme + Subtheme + Proficiency Level
      */

      const areaMatches =
        !courseArea ||
        !requiredArea ||
        courseArea === requiredArea;

      const themeMatches =
        courseTheme === requiredTheme;

      const subthemeMatches =
        courseSubtheme === requiredSubtheme;

      const proficiencyLevelMatches =
        courseProficiencyLevel === requiredProficiencyLevel;

      /*
      * All 4 parameters must match.
      *
      * If all 4 match:
      *     NOT part of gap
      *
      * If any one does not match:
      *     PART of gap
      */
      const allFourMatch =
        areaMatches &&
        themeMatches &&
        subthemeMatches &&
        proficiencyLevelMatches;

      const requiredLevel = this.getRequiredLevel(requiredCompetency);
      const currentLevel = this.getCurrentLevel(requiredCompetency);

      const requiredRank = this.getLevelRank(requiredLevel);
      const courseRank = this.getLevelRank(courseLevel);

      let status: GapStatus;
      let reason: string;

      if (allFourMatch) {
        /*
        * All four competency attributes match.
        * Therefore this competency is NOT part of the gap.
        */
        status = 'FULL';

        reason =
          'Competency Area, Theme, Subtheme and Proficiency Level all match. This competency is not part of the gap.';

      } else {
        /*
        * At least one of the four attributes does not match.
        * Therefore this competency is part of the gap.
        */

        const mismatches: string[] = [];

        if (!areaMatches) {
          mismatches.push('Competency Area');
        }

        if (!themeMatches) {
          mismatches.push('Theme');
        }

        if (!subthemeMatches) {
          mismatches.push('Subtheme');
        }

        if (!proficiencyLevelMatches) {
          mismatches.push('Proficiency Level');
        }

        status = 'NO_MATCH';

        reason =
          `${mismatches.join(', ')} ${mismatches.length === 1 ? 'does' : 'do'} not match. This competency is part of the gap.`;
      }

      results.push({
        area: this.getCompetencyArea(requiredCompetency),
        theme: this.getCompetencyTheme(requiredCompetency),
        subtheme: this.getCompetencySubtheme(requiredCompetency),
        proficiencyLevel: this.getProficiencyLevel(requiredCompetency),
        currentLevel,
        requiredLevel,
        courseLevel,
        status,
        reason
      });
    });
    });

    return this.removeDuplicateGapResults(results);
  }

  removeDuplicateGapResults(
    results: GapAnalysisResult[]
  ): GapAnalysisResult[] {
    const unique = new Map<string, GapAnalysisResult>();

    results.forEach(result => {
      const key = [
        this.normalize(result.area),
        this.normalize(result.theme),
        this.normalize(result.subtheme),
        this.normalize(result.proficiencyLevel),
        this.normalize(result.requiredLevel),
        this.normalize(result.courseLevel)
      ].join('|');

      if (!unique.has(key)) {
        unique.set(key, result);
      }
    });

    return Array.from(unique.values());
  }

  calculateAllCourseGaps(): void {
    this.courseGapResults = {};

    this.filterdCourses.forEach((course, index) => {
      this.courseGapResults[index] = this.calculateCourseGaps(course);
    });
  }

  getCourseGapResults(index: number): GapAnalysisResult[] {
    return this.courseGapResults[index] || [];
  }

  getFullMatches(index: number): GapAnalysisResult[] {
    return this.getCourseGapResults(index)
      .filter(result => result.status === 'FULL');
  }

  getPartialMatches(index: number): GapAnalysisResult[] {
    return this.getCourseGapResults(index)
      .filter(result => result.status === 'PARTIAL');
  }

  getNoMatches(index: number): GapAnalysisResult[] {
    return this.getCourseGapResults(index)
      .filter(result => result.status === 'NO_MATCH');
  }

  hasGapMatch(index: number): boolean {
    return this.getCourseGapResults(index).some(
      result =>
        result.status === 'FULL' ||
        result.status === 'PARTIAL'
    );
  }

  getCourseGapStatus(index: number): GapStatus {
    const results = this.getCourseGapResults(index);

    if (results.some(result => result.status === 'FULL')) {
      return 'FULL';
    }

    if (results.some(result => result.status === 'PARTIAL')) {
      return 'PARTIAL';
    }

    return 'NO_MATCH';
  }

  getCourseGapStatusLabel(index: number): string {
    switch (this.getCourseGapStatus(index)) {
      case 'FULL':
        return 'Full Gap Match';
      case 'PARTIAL':
        return 'Partial Gap Match';
      default:
        return 'No Gap Match';
    }
  }

  getCompetenciesByType(type: string, index: number): any[] {
    const course = this.filterdCourses[index];

    if (!course) {
      console.log(`No course found at index ${index}`);
      return [];
    }

    const competencies = this.getCourseCompetencies(course);

    if (!competencies.length) {
      console.log(`No competencies found for course ${index} and type ${type}`);
      return [];
    }

    const normalizedType = this.normalize(type);

    return competencies.filter((c: any) => {
      if (!c || !this.getCompetencyArea(c)) {
        return false;
      }

      const competencyArea = this.normalize(
        this.getCompetencyArea(c)
      );

      if (
        normalizedType === 'behavioural' ||
        normalizedType === 'behavioral'
      ) {
        return (
          competencyArea === 'behavioral' ||
          competencyArea === 'behavioural'
        );
      }

      return competencyArea === normalizedType;
    });
  }

  getDisplayedCompetencies(type: string, index: number): any[] {
    const competencies = this.getCompetenciesByType(type, index);
    const key = `${index}-${type}`;

    if (this.expandedCompetencies[key]) {
      return competencies;
    }

    return competencies.slice(0, 2);
  }

  toggleCompetencies(type: string, index: number): void {
    const key = `${index}-${type}`;
    this.expandedCompetencies[key] =
      !this.expandedCompetencies[key];
  }

  isExpanded(type: string, index: number): boolean {
    const key = `${index}-${type}`;
    return this.expandedCompetencies[key] || false;
  }

  hasMoreThanTwo(type: string, index: number): boolean {
    return this.getCompetenciesByType(type, index).length > 2;
  }

  getRemainingCount(type: string, index: number): number {
    const totalCount =
      this.getCompetenciesByType(type, index).length;

    return Math.max(totalCount - 2, 0);
  }
}
