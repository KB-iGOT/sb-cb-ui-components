import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, Inject } from "@angular/core";
import { Subscription } from "rxjs";
// tslint:disable-next-line
import * as _ from "lodash";
import { TranslateService } from "@ngx-translate/core";
import { ConfigurationsService, MultilingualTranslationsService, NsContent } from "@sunbird-cb/utils-v2";
import { Facet, FacetType, FormattedFacets, ICompentencyKeys, SearchCategory, SearchListingConfig } from "../../_models/search-listing.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ActivatedRoute } from "@angular/router";
import { MatRadioChange } from "@angular/material/radio";
// import { CATEGORY_TYPE } from "../../_constants/search-listing.constant";
import { SearchListingService } from "../../_services/search-listing.service";
import { DateRange, DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel } from "@angular/material/datepicker";

@Component({
  selector: "ws-app-search-filters",
  templateUrl: "./search-filters.component.html",
  styleUrls: ["./search-filters.component.scss"]
})
export class SearchFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() newfacets!: any;
  @Input() urlparamFilters!: any;
  @Output() appliedFilter = new EventEmitter<{ [key: string]: any }>();
  @Output() constructQueryParam = new EventEmitter<string>();
  @Output() applyFilterFromLearn = new EventEmitter<{ [key: string]: any }>();
  @Input() karmayogiBadge: any;
  competencyFactet: any;
  @Input() typesOfEvents: any;

  private subscription: Subscription = new Subscription();
  queryParams: any;

  categoryType: SearchListingConfig.SearchCategoryType[] = [];
  categoryTypeDup: SearchListingConfig.SearchCategoryType[] = [];
  categoryTypeEnum = SearchCategory;
  showAllLanguage = false;
  showAllContents = false;

  formattedFacets: any = {};
  selectedFilters: any = {};
  compentencyKey!: ICompentencyKeys;
  competencyAreaNameKey!: string;
  competencyThemeKey!: string;
  competencySubThemeKey!: string;
  showAllCompetencyTheme: boolean = false;
  showAllOrganisation: boolean = false;
  showAllCompetencySubTheme: boolean = false;
  showAllDesignation: boolean = false;
  showAllSectors: boolean = false;
  showResourceCategory: boolean = false;
  showAllSubSectors: boolean = false;
  showAllContentPartners: boolean = false;
  showAllTopic: boolean = false;
  showAllRoles = false;

  selectedFilterChips: any;
  filterQueryOrganisation = "";
  filterQueryContents = "";
  filterQueryLanguage = "";
  filterQueryDesignation = "";
  filterQueryRootOrgName = "";
  filterQueryThemes = "";
  filterQuerySectorNames = "";
  filterQueryResourceCategory = "";
  filterQuerySubSectorNames = "";
  filterQuerySubSectors: string = "";
  filterQuerySubThemes = "";
  filterCompetency = "";
  filterQueryContentPartners = "";
  filterQueryTopic = "";
  filterQueryRoles = "";

  searchCategory = "";
  searchQuery = "";
  isExploreContentTab = false;
  isAllContentSelected = true;
  environment!: any;
  searchConfig: SearchListingConfig.Config | null = null;
  selectedDateRange!: DateRange<Date> | null;
  maxDateCalendar = new Date();
  constructor(
    @Inject("environment") environment: any,
    private activated: ActivatedRoute,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService, // private router: Router
    private configSvc: ConfigurationsService,
    private searchService: SearchListingService,
    private selectionModel: MatRangeDateSelectionModel<Date>,
    private selectionStrategy: DefaultMatCalendarRangeStrategy<Date>
  ) {
    this.environment = environment;
    if (localStorage.getItem("websiteLanguage")) {
      this.translate.setDefaultLang("en");
      const lang = localStorage.getItem("websiteLanguage")!;
      this.translate.use(lang);
    }
  }

  async ngOnInit() {
    this.compentencyKey = this.configSvc.compentency[this.environment.compentencyVersionKey];
    this.competencyAreaNameKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyArea}`;
    this.competencyThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencyTheme}`;
    this.competencySubThemeKey = `${this.compentencyKey.vKey}.${this.compentencyKey.vCompetencySubTheme}`;

    this.subscription.add(
      this.activated.queryParams.subscribe(params => {
        this.isExploreContentTab = params["tab"] === "explore-content";
        if (this.isExploreContentTab) {
          this.selectedFilters = {};
          this.selectedFilterChips = [];
        }
      })
    );

    this.searchConfig = await this.searchService.getSearchConfig();

    if (this.searchConfig) {
      //Only allow communities for mdo_leader and mdo moderator in MDO
      if (this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal) {
        const userRoles = this.configSvc?.userRoles as Set<string>;
        if (this.searchConfig.searchCategories) {
          if (!userRoles.has("mdo_leader") && !userRoles.has("community_moderator")) {
            this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value !== SearchCategory.Communities);
          }
          if (userRoles.has("community_moderator")) {
            this.searchConfig.searchCategories = this.searchConfig?.searchCategories.filter(category => category?.value === SearchCategory.Communities);
          }
        }
      }

      const categories = this.searchConfig.searchCategories || [];

      const categorieTypes = this.searchConfig.allSearchCategoriesTypes || [];
      this.categoryType = categorieTypes.filter(cat => {
        return categories.some(category => category.value === cat.name);
      });
      this.categoryTypeDup = this.categoryType;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["newfacets"] && changes["newfacets"].currentValue) {
      this.formattedFacets = this.formatFacets(changes["newfacets"].currentValue);

      if (this.formattedFacets?.sectorId?.length) {
        const coursesCategory = _.find(this.categoryTypeDup, {
          name: "courses"
        });

        if (!coursesCategory) return;
      }

      // Handle nested filters for other categories
      if (this.formattedFacets?.nestedCategory?.length) {
        const nestedCategory = _.find(this.categoryTypeDup, {
          name: "nestedCategory"
        });

        if (nestedCategory) {
          nestedCategory.filters = this.formattedFacets.nestedCategory.map((filter: any) => ({
            name: filter.name,
            count: filter.count,
            isChecked: filter.isChecked,
            displayName: this.formatSectorName(filter.name)
          }));
        }
      }

      this.setCategoryType();
    }

    if (changes["typesOfEvents"] && changes["typesOfEvents"].currentValue) {
      this.formattedFacets["typeOfEvents"] = this.typesOfEvents;
    }

    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  formatSectorName(name: string): string {
    if (name.startsWith("sector-fw_sector_")) {
      name = name.replace("sector-fw_sector_", "");
    }
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  setCategoryType() {
    const params = this.activated.snapshot.queryParams;
    if (
      (this.searchCategory && params["category"] && this.searchCategory !== params["category"]) ||
      !params["category"] ||
      (params["q"] && params["q"] !== this.searchQuery)
    ) {
      this.selectedFilters = {};
      this.selectedDateRange = null;
      if (this.selectedFilters["dateRange"]) {
        this.selectedFilters["dateRange"] = [];
      }
    }

    if (params["q"]) {
      this.searchQuery = params["q"];
    }

    this.isExploreContentTab = !!params["tab"];

    this.searchCategory = params["category"];

    if (this.searchCategory) {
      this.categoryType = this.categoryTypeDup.filter(type => type.name === this.searchCategory);
      if (this.searchCategory === "case-study" && !this.categoryType.length) {
        this.categoryType = [
          {
            name: "case-study",
            count: 0,
            isChecked: false,
            displayName: "Case study",
            filters: [],
            disabled: false
          }
        ];
      }
      if (this.categoryType.length && !this.isExploreContentTab) {
        this.categoryType[0].isChecked = true;
        this.selectedFilters[this.categoryType[0].name] = [this.formatCategoryName(this.categoryType[0].name)];
        this.selectedFilterChips = [
          {
            value: this.categoryType[0].displayName,
            type: this.categoryType[0].name
          }
        ];
      }

      if (this.searchCategory === SearchCategory.Events) {
        this.formattedFacets["typeOfEvents"] = this.typesOfEvents;
      }
    } else {
      this.categoryType = this.categoryTypeDup.map(cat => ({
        ...cat,
        isChecked: cat.name === SearchCategory.All ? true : false
      }));
    }
    // }
  }

  setCourseCategoryType(contentType: string) {
    this.categoryTypeDup.map((item, parentIndex) => {
      if (item.name === contentType) {
        item.isChecked = true;
      } else if (item.filters) {
        this.checkForFilter(item, item.filters, contentType, parentIndex, parentIndex);
      }
    });
  }

  checkForFilter(parentData: any, filtersData: any, contentType: string, parentIndex: any, childIndex: any) {
    // this.selectedFilters['Course'] = []
    if (filtersData && filtersData.length) {
      filtersData.map((item: any, index: any) => {
        if (item.filters && item.filters.length) {
          this.checkForFilter(parentData, item.filters, contentType, parentIndex, index);
        } else {
          if (contentType.indexOf(item.name) > -1) {
            item.isChecked = true;
            parentData.filters[childIndex].isChecked = true;
            this.categoryTypeDup[parentIndex].isChecked = true;
            this.categoryType[0].isChecked = false;
            if (Object.keys(this.selectedFilters).length === 0) {
              this.selectedFilters["Course"] = [];
              this.selectedFilters["Course"] = contentType;
            } else {
              this.selectedFilters["Course"].concat(contentType);
            }
          } else {
            item.isChecked = false;
          }
        }
      });
      // this.appliedFilter.emit(this.selectedFilters);
      // this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      // console.log('this.selectedFilters',this.selectedFilters, this.categoryTypeDup[parentIndex].name)
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleShowMore(togglesection: string) {
    switch (togglesection) {
      case this.competencyThemeKey:
        this.showAllCompetencyTheme = !this.showAllCompetencyTheme;
        break;

      case this.competencySubThemeKey:
        this.showAllCompetencySubTheme = !this.showAllCompetencySubTheme;
        break;

      case FacetType.Language:
        this.showAllLanguage = !this.showAllLanguage;
        break;

      case FacetType.Organization:
      case FacetType.SourceName:
        this.showAllOrganisation = !this.showAllOrganisation;
        break;

      case FacetType.Designation:
        this.showAllDesignation = !this.showAllDesignation;
        break;

      case FacetType.courseCategory:
        this.showAllContents = !this.showAllContents;
        break;

      case FacetType.sectorNames_v1:
      case FacetType.sectorId:
      case FacetType.sectorNameResource:
        this.showAllSectors = !this.showAllSectors;
        break;

      case FacetType.subSectorNames_v1:
      case FacetType.subSectorId:
      case FacetType.subSectorNameResource:
        this.showAllSubSectors = !this.showAllSubSectors;
        break;

      case FacetType.resourceCategory:
        this.showResourceCategory = !this.showResourceCategory;
        break;

      case FacetType.contentPartners:
        this.showAllContentPartners = !this.showAllContentPartners;
        break;

      case FacetType.topic:
      case FacetType.topicName:
        this.showAllTopic = !this.showAllTopic;
        break;
      case FacetType.organizationsRoles:
        this.showAllRoles = !this.showAllRoles;
        break;
    }
  }

  translateActualLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, "");
  }

  formatFacets(data: Facet[][]): FormattedFacets {
    const formattedFacets: FormattedFacets | any = {};

    if (!data.length) return formattedFacets;

    const mergedData: { [key: string]: { [key: string]: number } } = data.reduce((acc, group) => {
      group.forEach(({ name, values }) => {
        if (!acc[name]) {
          acc[name] = {};
        }
        values.forEach(({ name: valueName, count }) => {
          if (valueName !== "") {
            acc[name][valueName] = (acc[name][valueName] || 0) + count;
          }
        });
      });
      return acc;
    }, {} as { [key: string]: { [key: string]: number } });

    Object.entries(mergedData).forEach(([key, values]) => {
      if (key === FacetType.Duration) {
        const formattedDurations = [
          { range: [0, 1800], label: "0 - 30 mins" },
          { range: [1801, 3600], label: "30 - 60 mins" },
          { range: [3601, 5400], label: "60 - 90 mins" },
          { range: [5401, Infinity], label: "90 mins" }
        ]
          .map(({ range, label }) => {
            const count = Object.entries(values)
              .filter(([key]) => {
                const duration = parseInt(key, 10);
                return duration >= range[0] && duration <= range[1];
              })
              .reduce((sum, [, count]) => sum + count, 0);
            return count > 0 ? { name: label, count, isChecked: false } : null;
          })
          .filter(Boolean);

        formattedFacets[key] = formattedDurations;
      } else if (key === FacetType.AvgRating) {
        const ratingRanges = [4.5, 4.0, 3.5, 3.0];
        const formattedRatings = ratingRanges
          .map(rating => {
            const count = Object.entries(values)
              .filter(([rate]) => parseFloat(rate) >= rating)
              .reduce((sum, [, count]) => sum + count, 0);
            return count > 0 ? { name: `${rating.toFixed(1)}`, count, isChecked: false } : null;
          })
          .filter(Boolean);

        formattedFacets[key] = formattedRatings;
      } else {
        formattedFacets[key] = Object.entries(values).map(([name, count]) => ({
          name,
          count,
          isChecked: false
        }));
      }
    });

    return formattedFacets;
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatRolesNames(str: string): string {
    const acronyms = ["MDO", "CBP", "SPV", "FRAC", "IFU", "WAT"];

    return str
      .split("_")
      .map(part => {
        const upperPart = part.toUpperCase();
        if (acronyms.includes(upperPart)) {
          return upperPart;
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(" ");
  }

  onSelectionFilter(event: MatCheckboxChange, option: any, categoryType: string) {
    const type = option?.name;
    option.isChecked = event.checked;
    if (!this.selectedFilters[categoryType]) {
      this.selectedFilters[categoryType] = [];
    }
    if (event.checked) {
      if (!this.selectedFilters[categoryType].includes(type)) {
        this.selectedFilters[categoryType].push(type);
      }
    } else {
      this.selectedFilters[categoryType] = this.selectedFilters[categoryType].filter((item: any) => item !== type);
    }

    Object.keys(this.selectedFilters).forEach(key => {
      if (Array.isArray(this.selectedFilters[key]) && this.selectedFilters[key].length === 0) {
        delete this.selectedFilters[key];
      }
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);

    const types = this.categoryTypeDup.map(category => category.name);
    if (types.includes(type) && !option.isChecked) {
      this.constructQueryParam.emit("");
    }

    if (categoryType === "contentType" && this.isAllContentSelected) {
      this.isAllContentSelected = false;
    }
  }

  onRadioTypeChange(_event: MatRadioChange, option: any, radioType: string) {
    const type = option?.name;
    this.selectedFilters[radioType] = [type];

    const eventOptions = this.formattedFacets[radioType];
    if (eventOptions) {
      eventOptions.forEach((opt: any) => {
        opt.isChecked = opt.name === type;
      });
    }

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  togoleThemes(competency: any) {
    competency["showAll"] = !competency["showAll"];
  }

  get filtersAppliedCount(): number {
    return Object.entries(this.selectedFilters).filter(([_, arr]) => Array.isArray(arr) && arr.length > 0).length;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  refactorFilterData(data: Record<string, string[]>): { type: string; value: string }[] {
    if (typeof data !== "object" || data === null) {
      return [];
    }

    const returnedData: { type: string; value: string }[] = [];

    Object.entries(data).forEach(([key, values]) => {
      if (key === "dateRange") {
        const mergedDates = values.map(this.formatDate).join(" - ");
        if (mergedDates) {
          returnedData.push({ type: key, value: mergedDates });
        }
      } else {
        values.forEach(value => {
          returnedData.push({
            type: key,
            value: value === "Courses" ? "Contents" : this.formatValue(value)
          });
        });
      }
    });

    this.categoriseByFacet(returnedData);
    return returnedData;
  }

  categoriseByFacet(facetData: any) {
    const groupedData = _.groupBy(facetData, "type");
    const visibilityMap: { key: string; enableKey: any }[] = [
      // Sector related
      { key: FacetType.sectorNames_v1, enableKey: "showAllSectors" },
      { key: FacetType.sectorId, enableKey: "showAllSectors" },
      { key: FacetType.sectorNameResource, enableKey: "showAllSectors" },
      { key: "sectorName", enableKey: "showAllSectors" },
      
      // Sub-sector related
      { key: FacetType.subSectorNames_v1, enableKey: "showAllSubSectors" },
      { key: FacetType.subSectorId, enableKey: "showAllSubSectors" },
      { key: FacetType.subSectorNameResource, enableKey: "showAllSubSectors" },
      { key: "subSectorName", enableKey: "showAllSubSectors" },
      
      // Language
      { key: FacetType.Language, enableKey: "showAllLanguage" },
      
      // Organization related
      { key: FacetType.Organization, enableKey: "showAllOrganisation" },
      { key: FacetType.SourceName, enableKey: "showAllOrganisation" },
      { key: "rootOrgName", enableKey: "showAllOrganisation" },
      
      // Competency related
      { key: this.competencyThemeKey, enableKey: "showAllCompetencyTheme" },
      { key: this.competencySubThemeKey, enableKey: "showAllCompetencySubTheme" },
      
      // Content related
      { key: FacetType.courseCategory, enableKey: "showAllContents" },
      { key: FacetType.contentPartners, enableKey: "showAllContentPartners" },
      { key: "contentPartner.contentPartnerName", enableKey: "showAllContentPartners" },
      
      // Resource related
      { key: FacetType.resourceCategory, enableKey: "showResourceCategory" },
      
      // Topics
      { key: FacetType.topic, enableKey: "showAllTopic" },
      { key: FacetType.topicName, enableKey: "showAllTopic" },
      
      // Designation
      { key: FacetType.Designation, enableKey: "showAllDesignation" },
      { key: "profileDetails.professionalDetails.designation", enableKey: "showAllDesignation" },
      
      { key: FacetType.organizationsRoles, enableKey: "showAllRoles" },
    ];

    visibilityMap.forEach(({ key, enableKey }) => {
      (this as any)[enableKey] = groupedData[key]?.length > 0 || false;
    });
  }

  private formatValue(value: string): string {
    if (value.startsWith("sector-fw_sector_")) {
      return this.formatSectorName(value);
    }
    return this.capitalizeFirstLetter(value);
  }

  private reverseFormatSectorName(formattedName: string): string {
    const originalName = formattedName.toLowerCase().split(" ").join("-");
    return `sector-fw_sector_${originalName}`;
  }

  clearFilterChip(item: { type: string; value: string }) {
    let facets;
    if (item.type === "dateRange") {
      this.clearDateRange();
      return;
    }
    if (item.type === "sectorId" || item.type === "subSectorId") {
      item.value = this.reverseFormatSectorName(item.value);
    }

    if (item.type === "sectorDetails_v1.subSectorName") {
      item.value = item.value.toLowerCase();
    }
    const types = this.categoryTypeDup.map((category: any) => category.name);
    if (this.searchCategory === "case-study") {
      types.push("case-study");
    }
    if (types.includes(item.type)) {
      facets = this.categoryType;

      const category = _.find(facets, { name: item.type });

      if (category) {
        this.clearAllFilters();
        return;
      }

      const foundFilter = _.find(category!.filters, { name: item.value });
      if (foundFilter) {
        foundFilter.isChecked = false;

        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      }
    } else {
      facets = this.formattedFacets;

      const allFilters = _.flatMap(facets);
      let foundFilter: any;
      foundFilter = _.find(allFilters, {
        name: item.value.toLowerCase()
      });

      if (!foundFilter) {
        foundFilter = _.find(allFilters, {
          name: item.value
        });
      }

      if (foundFilter) {
        foundFilter.isChecked = false;
        if (_.has(this.selectedFilters, item.type)) {
          _.pull(this.selectedFilters[item.type], foundFilter.name);
          if (_.isEmpty(this.selectedFilters[item.type])) {
            // delete this.selectedFilters[item.type];
          }
        }

        this.appliedFilter.emit(this.selectedFilters);
        this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
      } else {
        const foundCategory = _.find(this.categoryTypeDup, {
          name: SearchCategory.Courses
        });
        if (foundCategory) {
          const found = this.recursivelySetIsCheckedFalse(foundCategory.filters, item.value.toLowerCase());
          if (found) {
            found.isChecked = false;
            if (_.has(this.selectedFilters, item.type)) {
              if (item.value.toLowerCase().startsWith("sector-fw_sector_")) {
                _.pull(this.selectedFilters[item.type], item.value.toLowerCase());
              } else {
                _.pull(this.selectedFilters[item.type], item.value);
              }
              if (_.isEmpty(this.selectedFilters[item.type])) {
                delete this.selectedFilters[item.type];
              }
            }
            this.appliedFilter.emit(this.selectedFilters);
            this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
          }
        }
        // In case if no conditions are matched
        else {
          if (Array.isArray(this.selectedFilters[item.type])) {
            const updatedArr = this.selectedFilters[item.type].filter((val: any) => val.toLowerCase() !== item.value?.toLowerCase());
            if (updatedArr.length) {
              this.selectedFilters = { ...this.selectedFilters, [item.type]: updatedArr };
            } else {
              // Remove the property if array is empty
              const { [item.type]: _, ...rest } = this.selectedFilters;
              this.selectedFilters = rest;
            }

            this.appliedFilter.emit(this.selectedFilters);
            this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
          }
        }
      }
    }
  }

  clearAllFilters() {
    Object.keys(this.selectedFilters).forEach(key => {
      this.selectedFilters[key] = [];
    });

    if (!this.isExploreContentTab) {
      _.forEach(this.categoryType, (category: any) => {
        category.isChecked = false;
        _.forEach(category.filters, (filter: any) => {
          filter.isChecked = false;
        });
      });
    } else {
      this.isAllContentSelected = true;
    }

    _.forEach(this.formattedFacets, (filters: any) => {
      _.forEach(filters, (filter: any) => {
        filter.isChecked = false;
      });
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = [];

    if (!this.isExploreContentTab) {
      this.constructQueryParam.emit("");
    }
  }

  get filteredOrganisations() {
    let data: any;
    if (this.searchCategory === SearchCategory.Events) {
      data = this.formattedFacets[FacetType.SourceName];
    } else {
      data = this.formattedFacets[FacetType.Organization];
    }
    let filteredList = data?.filter((item: any) => item.name.toLowerCase().includes(this.filterQueryOrganisation.toLowerCase()));

    if (this.filterQueryOrganisation) return filteredList;

    return this.showAllOrganisation ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredContents() {
    let filteredList = this.formattedFacets[FacetType.courseCategory].filter((item: any) =>
      item.name.toLowerCase().includes(this.filterQueryContents.toLowerCase())
    );

    if (this.filterQueryContents) return filteredList;

    return this.showAllContents ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredLanguages() {
    let filteredList = this.formattedFacets[FacetType.Language].filter((item: any) => item.name.toLowerCase().includes(this.filterQueryLanguage.toLowerCase()));

    if (this.filterQueryLanguage) return filteredList;

    return this.showAllLanguage ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredSectorNames() {
    let data;
    if (this.formattedFacets[FacetType.sectorNames_v1]) {
      data = this.formattedFacets[FacetType.sectorNames_v1];
    } else if (this.formattedFacets[FacetType.sectorNameResource]) {
      data = this.formattedFacets[FacetType.sectorNameResource];
    }

    let filteredList = data.filter((item: any) => item.name.toLowerCase().includes(this.filterQuerySectorNames.toLowerCase()));

    if (this.filterQuerySectorNames) return filteredList;

    return this.showAllSectors ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredSubSectorNames() {
    let data;
    if (this.formattedFacets[FacetType.subSectorNames_v1]) {
      data = this.formattedFacets[FacetType.subSectorNames_v1];
    } else if (this.formattedFacets[FacetType.subSectorNameResource]) {
      data = this.formattedFacets[FacetType.subSectorNameResource];
    }

    let filteredList = data.filter((item: any) => item.name.toLowerCase().includes(this.filterQuerySubSectorNames.toLowerCase()));

    if (this.filterQuerySubSectorNames) return filteredList;

    return this.showAllSubSectors ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredSectorId() {
    let filteredList = this.formattedFacets[FacetType.sectorId].filter((item: any) =>
      item.name.toLowerCase().includes(this.filterQuerySectorNames.toLowerCase())
    );

    if (this.filterQuerySectorNames) return filteredList;

    return this.showAllSectors ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredSubSectorId() {
    let filteredList = this.formattedFacets[FacetType.subSectorId].filter((item: any) =>
      item.name.toLowerCase().includes(this.filterQuerySubSectorNames.toLowerCase())
    );

    if (this.filterQuerySubSectorNames) return filteredList;

    return this.showAllSubSectors ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredDesignations() {
    let filteredList = this.formattedFacets["profileDetails.professionalDetails.designation"]?.filter((item: any) =>
      item?.name.toLowerCase().includes(this.filterQueryDesignation.toLowerCase())
    );

    if (this.filterQueryDesignation) return filteredList;

    return this.showAllDesignation ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredRootOrgNames() {
    let filteredList = this.formattedFacets["rootOrgName"]?.filter((item: any) => item?.name.toLowerCase().includes(this.filterQueryRootOrgName.toLowerCase()));

    if (this.filterQueryRootOrgName) return filteredList;

    return this.showAllOrganisation ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredCompetencyTheme() {
    let filteredList = this.formattedFacets[this.competencyThemeKey]?.filter((item: any) =>
      item?.name.toLowerCase().includes(this.filterQueryThemes.toLowerCase())
    );

    if (this.filterQueryThemes) return filteredList;

    return this.showAllCompetencyTheme ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredSubCompetencyTheme() {
    let filteredList = this.formattedFacets[this.competencySubThemeKey]?.filter((item: any) =>
      item?.name.toLowerCase().includes(this.filterQuerySubThemes.toLowerCase())
    );

    if (this.filterQuerySubThemes) return filteredList;

    return this.showAllCompetencySubTheme ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredResourceCategory() {
    let filteredList = this.formattedFacets[FacetType.resourceCategory].filter((item: any) =>
      item.name.toLowerCase().includes(this.filterQueryResourceCategory.toLowerCase())
    );

    if (this.filterQueryResourceCategory) return filteredList;

    return this.showResourceCategory ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredContentPartners() {
    let filteredList = this.formattedFacets[FacetType.contentPartners].filter((item: any) =>
      item.name.toLowerCase().includes(this.filterQueryContentPartners.toLowerCase())
    );

    if (this.filterQueryContentPartners) return filteredList;

    return this.showAllContentPartners ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredRoles() {
    let filteredList = this.formattedFacets["roles.role"]?.filter((item: any) => item?.name.toLowerCase().includes(this.filterQueryRoles.toLowerCase()));

    if (this.filterQueryRoles) return filteredList;

    return this.showAllRoles ? filteredList : filteredList?.slice(0, 4);
  }

  get filteredTopic() {
    let filterData;
    if (this.formattedFacets[FacetType.topic]) {
      filterData = this.formattedFacets[FacetType.topic];
    } else if (this.formattedFacets[FacetType.topicName]) {
      filterData = this.formattedFacets[FacetType.topicName];
    }
    let filteredList = filterData.filter((item: any) => item.name.toLowerCase().includes(this.filterQueryTopic.toLowerCase()));

    if (this.filterQueryTopic) return filteredList;

    return this.showAllTopic ? filteredList : filteredList?.slice(0, 4);
  }

  private recursivelySetIsCheckedFalse(filters: any[], name: string): any {
    for (const filter of filters) {
      if ((filter?.name).toLowerCase() === name.toLowerCase()) {
        filter.isChecked = false;
        return filter;
      }
      if (filter.filters?.length) {
        const found = this.recursivelySetIsCheckedFalse(filter.filters, name.toLowerCase());
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private formatCategoryName(name: string): string {
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  allContentSelection() {
    this.isAllContentSelected = true;
    this.selectedFilters["contentType"] = [];

    this.filteredContents.map((item: any) => {
      item.isChecked = false;
    });

    this.appliedFilter.emit(this.selectedFilters);
    this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
  }

  getSelectedFilter(item: any) {
    if (Object.keys(this.selectedFilters).length) {
      return this.filterValueExists(this.selectedFilters, item?.name);
    }
  }

  filterValueExists(obj: any, target: any): any {
    if (Array.isArray(obj)) {
      return obj.some(item => this.filterValueExists(item, target));
    } else if (obj !== null && typeof obj === "object") {
      return Object.values(obj).some(value => this.filterValueExists(value, target));
    } else {
      return obj === target;
    }
  }

  rangeChanged(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(selectedDate, selection);

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(newSelection.start, newSelection.end);

    if (this.selectedDateRange?.start && this.selectedDateRange?.end) {
      const formattedStartDate = this.formatDateForFilter(this.selectedDateRange.start, this.searchCategory);
      const formattedEndDate = this.formatDateForFilter(this.selectedDateRange.end, this.searchCategory, true);

      this.selectedFilters["dateRange"] = [formattedStartDate, formattedEndDate];
      this.appliedFilter.emit(this.selectedFilters);
      this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    }
  }

  private formatDateForFilter(date: Date, category: string, end = false): string {
    const pad = (num: number, size = 2) => num.toString().padStart(size, "0");

    if (end) {
      date.setHours(23, 59, 59, 999);
    }

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    const timezoneOffset = -date.getTimezoneOffset();
    const sign = timezoneOffset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

    if (category === SearchCategory.Users) {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}${sign}${offsetHours}${offsetMinutes}`;
    } else {
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}${offsetMinutes}`;
    }
  }

  clearDateRange() {
    this.selectedDateRange = null;
    if (this.selectedFilters["dateRange"]) {
      this.selectedFilters["dateRange"] = [];
      this.appliedFilter.emit(this.selectedFilters);
      this.selectedFilterChips = this.refactorFilterData(this.selectedFilters);
    } else {
      this.appliedFilter.emit(this.selectedFilters);
    }
  }

  get isUserFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Users && this.isFilterFacetsAvailable;
  }

  get isDesignationFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Designation && this.isFilterFacetsAvailable;
  }

  get isEventsFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Events && this.isFilterFacetsAvailable;
  }

  get isCommunityFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.Communities && this.isFilterFacetsAvailable;
  }

  get isTrainingPlanFacetsPresent(): boolean {
    return this.searchCategory === SearchCategory.TrainingPlans && this.isFilterFacetsAvailable;
  }

  get isFilterFacetsAvailable(): boolean {
    return (
      this.formattedFacets &&
      Object.keys(this.formattedFacets).length > 0 &&
      Object.values(this.formattedFacets).some((facet: any) => facet && facet?.length > 0)
    );
  }

  get sortedUserGroup() {
    const groupFacet = this.formattedFacets?.[FacetType.profileGroup];
    return !groupFacet || !Array.isArray(groupFacet)
      ? []
      : [
          ...groupFacet.filter(g => g.name.toLowerCase().startsWith("group")).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })),
          ...groupFacet.filter(g => !g.name.toLowerCase().startsWith("group")).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
        ];
  }

  get canShowTypeOfEventsFilter(): boolean {
    return (
      (this.formattedFacets["typeOfEvents"]?.some((event: any) => event.count > 0) &&
        this.searchConfig?.applicationName !== SearchListingConfig.ApplicationNames.MDOPortal) ??
      false
    );
  }

  get canShowEventsStatusFilter(): boolean {
    return !!(
      this.searchCategory === SearchCategory.Events &&
      this.isEventsFacetsPresent &&
      this.formattedFacets["status"]?.length &&
      this.searchConfig?.applicationName === SearchListingConfig.ApplicationNames.MDOPortal
    );
  }

  formatFilterChips(value: string): string {
    if (!value) {
      return value;
    }
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else if (this.searchCategory === SearchCategory.Events && value.toLowerCase() === "live") {
      return "Published";
    } else if (this.searchCategory === SearchCategory.Events && value.toLowerCase() === "senttopublish") {
      return "Pending Approval";
    } else if (value.includes("_")) {
      return this.formatRolesNames(value);
    }

    return value;
  }

  getCalendarLabel(): string {
    if (this.isUserFacetsPresent) {
      return "learnsearch.onBoardingDateRange";
    } else if (this.isDesignationFacetsPresent) {
      return "learnsearch.importedOn";
    } else if (this.isEventsFacetsPresent) {
      return "searchfilters.eventDate";
    } else if (this.isCommunityFacetsPresent) {
      return "searchfilters.createdOn";
    } else if (this.isTrainingPlanFacetsPresent) {
      return "searchfilters.createdOn";
    }
    return "";
  }

  formatEventStatusName(name: string): string {
    if (name === "live") return "Published";
    else if (name === "senttopublish") return "Pending Approval";
    return this.capitalizeFirstLetter(name);
  }
}
