import { HttpClient } from "@angular/common/http";
import { Injectable, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";
import {
  IReusableUserGroupReadResponse,
  IReusableUserGroupRequest,
  IReusableUserGroupSearchRequest,
  IReusableUserGroupSearchResponse,
  IUserGroupRequest,
  NsAccessControlConfig
} from "../_models/access-control.model";
import { toNumber } from "lodash";

const PAGINATION_LIMIT = 100;
const ENDPOINTS = {
  SEARCH_USER_WITH_ADMIN: (query: string) => `/apis/proxies/v8/user/v1/autocomplete/${query}`,
  SEARCH_USER: `/apis/proxies/v8/user/v1/admin/search`,
  SEARCH_ORG: "/apis/proxies/v8/org/v1/admin/search",
  VALIDATE_USER: "/apis/proxies/v8/user/v1/search",
  GROUPS: "/apis/proxies/v8/user/v1/groups",
  CADRE_CONFIG: "/apis/proxies/v8/data/v2/system/settings/get/cadreConfig",
  DESIGNATION_LIST: "/apis/proxies/v8/designation/search",
  SEARCH_V4: "/apis/proxies/v8/sunbirdigot/v4/search",
  CREATE_USERGROUPS_CONTROL: "/apis/proxies/v8/accessSettings/v1/upsert",
  CREATE_REUSABLE_USER_GROUP: "/apis/proxies/v8/usergroup/v1/create",
  UPDATE_REUSABLE_USER_GROUP: "/apis/proxies/v8/usergroup/v1/update",
  SEARCH_REUSABLE_USER_GROUPS: "/apis/proxies/v8/usergroup/v1/search",
  READ_REUSABLE_USER_GROUP: (id: string) => `/apis/proxies/v8/usergroup/v1/read/${id}`,
  GET_ACCESS_CONTROL: (id: string) => `/apis/proxies/v8/accessSettings/read/${id}`,
  ACTION_CONTENT_V3: `apis/proxies/v8/action/content/v3/`,
  PRIVATE_CONTENT_V4: `apis/proxies/v8/private/content/v4/`,

  CUSTOMES_FIELD_SEARCH: "apis/proxies/v8/customFields/v1/search",
  ORG_HIERARCHY_FRAMEWORK: (frameworkId: string) => `/apis/proxies/v8/framework/v1/read/${frameworkId}`,
  ORG_READ: "/apis/proxies/v8/org/v1/read",
};

const L0_ORG_TYPES = ["ministry", "state"];
// The roles that administer an organisation, at whatever level of the hierarchy it sits.
const ORG_HIERARCHY_ROLES = ["mdo_admin", "mdo_leader"];

@Injectable({
  providedIn: "root",
})
export class AccessControlService {
  accessControlConfig: WritableSignal<NsAccessControlConfig.IAccessControlConfig>;
  holdServiceCadrebatch: WritableSignal<{
    service: { id: string; name: string }[];
    batch: number[];
    cadre: { id: string; name: string }[];  
  }>;
  customesFieldData: WritableSignal<any[]> = signal([]);
  // Organisations of the logged in L0 MDO hierarchy (L0 -> L10), read from the org hierarchy framework
  orgHierarchyOrganisations: WritableSignal<any[]> = signal([]);
  // The L0 the logged in organisation sits under, read once and kept: it answers both for the
  // hierarchy framework and for the state whose services the organisation may select from.
  parentOrganisation: WritableSignal<any> = signal(null);
  constructor(private readonly http: HttpClient) {
    this.accessControlConfig = signal<NsAccessControlConfig.IAccessControlConfig>(null);
    this.holdServiceCadrebatch = signal({
      service: [],
      batch: [],
      cadre: [],
    });
  }

  fetchUserListWithAdmin(queryString: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.SEARCH_USER_WITH_ADMIN(queryString));
  }

  fetchUserList(query: string, pagination: { limit: number; offset: number }, userIds?: string[], filters?: any, sorting?: any): Observable<any> {
    let request: any = {
      filters: {
        status: 1,
      },
      limit: pagination.limit || 5,
      offset: pagination.offset || 0,
      query: query,
      sort_by: {},
      fields: ["userId", "firstName", "maskedEmail", "rootOrgName", "phone"],
    };
    if (userIds?.length) {
      request.filters = { ...request.filters, userId: userIds };
    }
    if (filters) {
      request.filters = { ...request.filters, ...filters };
    }
    if (sorting) {
      request.sort_by = sorting;
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_USER, { request: request });
  }

  fetchOrgList(query: string, pagination: { limit: number; offset: number }, selectedData?: string[], characterSearch?: string): Observable<any> {
    let request: any = {
      request: {
        filters: {
          status: 1,
          // isMdo: true,
        },
        // sort_by: {
        //   channel: "asc", 
        // },
        fields: ["channel", "identifier", "iscca"],
        query: query,
        limit: pagination.limit,
        offset: pagination.offset,
      },
    };
    if (selectedData?.length) {
      request.request.filters.identifier = selectedData;
      characterSearch = "";
    }

    if (characterSearch && characterSearch !== '#' && !query) {
      request.request.filters.channel = { startsWith: characterSearch };
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_ORG, request);
  }

  fetchOrgHierarchyFramework(frameworkId: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.ORG_HIERARCHY_FRAMEWORK(frameworkId));
  }

  fetchOrgRead(organisationId: string): Observable<any> {
    return this.http.post<any>(ENDPOINTS.ORG_READ, { request: { organisationId } });
  }

  /** Whether the user administers their organisation, which is what the condition is offered on. */
  hasOrgHierarchyRole(config?: NsAccessControlConfig.IAccessControlConfig): boolean {
    const userRoles = (config || this.accessControlConfig())?.userConfig?.userRoles;
    return ORG_HIERARCHY_ROLES.some((role: string) =>
      typeof userRoles?.has === "function" ? userRoles.has(role) : (userRoles || []).includes?.(role)
    );
  }

  /**
   * A L0 MDO is a mdo_admin / mdo_leader of a ministry or a state organisation,
   * i.e the organisation sitting at the top (L0) of its own org hierarchy.
   */
  isL0MdoUser(config?: NsAccessControlConfig.IAccessControlConfig): boolean {
    const orgType = ((config || this.accessControlConfig())?.userConfig?.org?.sbOrgType || "").toLowerCase();
    return L0_ORG_TYPES.includes(orgType) && this.hasOrgHierarchyRole(config);
  }

  getOrgHierarchyFrameworkId(config?: NsAccessControlConfig.IAccessControlConfig): string {
    return (config || this.accessControlConfig())?.userConfig?.org?.orgHierarchyFrameworkId || "";
  }

  /** The L0 the logged in organisation is mapped to, read off its own organisation. */
  getParentOrgId(config?: NsAccessControlConfig.IAccessControlConfig): string {
    return (config || this.accessControlConfig())?.userConfig?.org?.ministryOrStateId || "";
  }

  /**
   * The org hierarchy framework that applies to the logged in user. Only the L0 - the ministry
   * or the state at the top - carries one on its own organisation. Every organisation under it,
   * L1 to Ln, has none of its own and answers from the L0 it is mapped to, which is why the
   * parent is read rather than the condition being offered to the L0 alone.
   */
  async resolveOrgHierarchyFrameworkId(config?: NsAccessControlConfig.IAccessControlConfig): Promise<string> {
    const ownFrameworkId = this.getOrgHierarchyFrameworkId(config);
    if (ownFrameworkId) {
      return ownFrameworkId;
    }

    const parentOrganisation = await this.readParentOrganisation(config);
    return parentOrganisation?.orgHierarchyFrameworkId || "";
  }

  /**
   * Reads the L0 the logged in organisation is mapped to, once. Both the hierarchy framework and
   * the state the organisation belongs to are read off it, so the two do not read it twice, and
   * an organisation that sits under no L0 keeps it null.
   */
  async readParentOrganisation(config?: NsAccessControlConfig.IAccessControlConfig): Promise<any> {
    const parentOrgId = this.getParentOrgId(config);
    if (!parentOrgId) {
      this.parentOrganisation.set(null);
      return null;
    }

    const alreadyRead = this.parentOrganisation();
    if (alreadyRead && (alreadyRead.id === parentOrgId || alreadyRead.identifier === parentOrgId)) {
      return alreadyRead;
    }

    const response = await this.fetchOrgRead(parentOrgId)
      .toPromise()
      .catch(() => null);

    const organisation = response?.result?.response || null;
    this.parentOrganisation.set(organisation);
    return organisation;
  }

  /**
   * The state the logged in organisation belongs to, "" when it belongs to none. A L0 state
   * organisation is the state itself. Anything under it - L1 to Ln - carries only a pointer up,
   * and the name is read off the L0 that was read for the hierarchy: the org apis spell the name
   * on the organisation itself inconsistently, and where they leave it out the state services
   * were offered to the L0 alone.
   */
  getOrgStateName(config?: NsAccessControlConfig.IAccessControlConfig): string {
    const org = (config || this.accessControlConfig())?.userConfig?.org;

    if ((org?.sbOrgType || "").toLowerCase() === "state") {
      return org?.orgName || org?.channel || "";
    }

    if ((org?.ministryOrStateType || "").toLowerCase() !== "state") {
      return "";
    }

    const parentOrganisation = this.parentOrganisation();
    return (
      org?.ministryOrStateName ||
      org?.ministryorstatename ||
      parentOrganisation?.orgName ||
      parentOrganisation?.channel ||
      ""
    );
  }

  /**
   * Reads the org hierarchy framework that applies to the logged in user - their own when they
   * are the L0, the one of the L0 they are mapped to otherwise - and flattens it into a single
   * organisation list.
   *
   * What is flattened is the branch the logged in organisation sits at the top of, not the whole
   * framework: an organisation administers itself and what is under it, never what sits beside
   * it. The L0 is the exception, and only because it is not a term of its own framework at all -
   * nothing roots the walk for it, and the whole hierarchy is its own branch.
   *
   * Returns an empty list when the framework is not created, in which case the organisation
   * condition should not be offered at all.
   */
  async fetchOrgHierarchyOrganisations(config?: NsAccessControlConfig.IAccessControlConfig): Promise<any[]> {
    const frameworkId = await this.resolveOrgHierarchyFrameworkId(config);

    if (!frameworkId) {
      this.orgHierarchyOrganisations.set([]);
      return [];
    }

    const response = await this.fetchOrgHierarchyFramework(frameworkId)
      .toPromise()
      .catch(() => null);

    const categories = response?.result?.framework?.categories || [];
    const termsById = this.indexFrameworkTerms(categories);
    // The same organisation can be mapped more than once, so every term of it roots the walk
    const ownTerms = this.findTermsByOrgId(termsById, this.getLoggedInOrgId(config));
    const terms = ownTerms.length ? this.collectBranchTerms(termsById, ownTerms) : Array.from(termsById.values());

    const organisations: any[] = [];
    const addedOrgIds = new Set<string>();

    terms.forEach((term: any) => {
      const identifier = term?.additionalProperties?.orgId;
      const channel = term?.name;
      if (identifier && channel && !addedOrgIds.has(identifier)) {
        addedOrgIds.add(identifier);
        organisations.push({ identifier, channel, category: term?.category, iscca: false });
      }
    });

    organisations.sort((orgA: any, orgB: any) => (orgA.channel || "").localeCompare(orgB.channel || ""));

    // The L0 is not a term of its own hierarchy framework, so the organisation of the logged in
    // user is put on top of the mapped ones. It stays selectable even when nothing is mapped yet.
    // An organisation below the L0 is a term of the framework already, and is left where it is.
    const loggedInOrganisation = await this.getLoggedInOrganisation(config);
    if (loggedInOrganisation && !addedOrgIds.has(loggedInOrganisation.identifier)) {
      addedOrgIds.add(loggedInOrganisation.identifier);
      organisations.unshift(loggedInOrganisation);
    }

    this.orgHierarchyOrganisations.set(organisations);
    return organisations;
  }

  /**
   * Every term of the framework by its identifier. A term is listed twice - once under its own
   * category, and once as an association of the term above it - and only the copy under its own
   * category carries the associations below it. This index is that copy.
   */
  private indexFrameworkTerms(categories: any[]): Map<string, any> {
    const termsById = new Map<string, any>();
    (categories || []).forEach((category: any) => {
      (category?.terms || []).forEach((term: any) => {
        if (term?.identifier) {
          termsById.set(term.identifier, { ...term, category: term?.category || category?.name });
        }
      });
    });
    return termsById;
  }

  /** The terms an organisation is mapped as, which is where its branch of the hierarchy starts. */
  private findTermsByOrgId(termsById: Map<string, any>, orgId: string): any[] {
    if (!orgId) {
      return [];
    }
    return Array.from(termsById.values()).filter(
      (term: any) => term?.additionalProperties?.orgId === orgId
    );
  }

  /**
   * An organisation and everything under it. Each association is read back off the index rather
   * than walked as it is embedded: the embedded copy carries no associations of its own, so
   * following it would stop the walk one level down and lose L3 and below.
   */
  private collectBranchTerms(termsById: Map<string, any>, rootTerms: any[]): any[] {
    const branch: any[] = [];
    const visited = new Set<string>();
    const queue = [...rootTerms];

    while (queue.length) {
      const term = queue.shift();
      const identifier = term?.identifier;
      if (!identifier || visited.has(identifier)) {
        continue;
      }
      visited.add(identifier);
      branch.push(term);

      (term?.associations || []).forEach((association: any) => {
        const child = termsById.get(association?.identifier) || association;
        if (child?.identifier && !visited.has(child.identifier)) {
          queue.push(child);
        }
      });
    }

    return branch;
  }

  /**
   * Organisation of the logged in user as an entry of the organisation selection list. The name is
   * read from the org details held on the config, when it is not there it is resolved with a search
   * on the organisation id so the entry is never dropped for a missing name.
   */
  private async getLoggedInOrganisation(config?: NsAccessControlConfig.IAccessControlConfig): Promise<any> {
    const userConfig = (config || this.accessControlConfig())?.userConfig;
    const orgId = this.getLoggedInOrgId(config);

    if (!orgId) {
      return null;
    }

    let orgName = userConfig?.org?.orgName || userConfig?.org?.channel || userConfig?.rootOrgName || "";
    if (!orgName) {
      const response = await this.fetchOrgList("", { limit: 1, offset: 0 }, [orgId])
        .toPromise()
        .catch(() => null);
      orgName = response?.result?.response?.content?.[0]?.channel || "";
    }

    return {
      identifier: orgId,
      channel: orgName || orgId,
      category: "L0",
      iscca: userConfig?.org?.isCCA ?? false,
    };
  }

  /**
   * Organisation of the logged in MDO. For a L0 MDO this is the ministry / state itself and is used
   * as the ministryOrStateId when every organisation of its hierarchy gets selected.
   */
  getLoggedInOrgId(config?: NsAccessControlConfig.IAccessControlConfig): string {
    const userConfig = (config || this.accessControlConfig())?.userConfig;
    return userConfig?.org?.rootOrgId || userConfig?.org?.id || userConfig?.rootOrgId || "";
  }

  /**
   * Every organisation id of the logged in L0 MDO hierarchy (its own organisation included).
   */
  getOrgHierarchyOrgIds(): string[] {
    return (this.orgHierarchyOrganisations() || []).map((org: any) => org?.identifier).filter(Boolean);
  }

  /**
   * True when the given selections cover every organisation of the logged in L0 MDO hierarchy,
   * i.e the user has selected all the organisations available to it.
   */
  areAllOrgHierarchyOrgsSelected(selections: any[]): boolean {
    const hierarchyOrgIds = this.getOrgHierarchyOrgIds();
    if (!hierarchyOrgIds.length || !selections?.length) {
      return false;
    }
    const selectedOrgIds = new Set(selections.map((selection: any) => String(selection)));
    return hierarchyOrgIds.every((orgId: string) => selectedOrgIds.has(String(orgId)));
  }

  validateUser(request: any): Observable<any> {
    return this.http.post<any>(ENDPOINTS.VALIDATE_USER, request);
  }

  fetchGroupsList(): Observable<any> {
    return this.http.get<any>(ENDPOINTS.GROUPS);
  }

  fetchCadreConfig(): Promise<any> {
    return this.http.get<any>(ENDPOINTS.CADRE_CONFIG).toPromise();
  }

  fetchDesignation(query: string, pagination: { pageSize: number; pageNumber: number }, selectedData?: string[], characterSearch?: string): Observable<any> {
    let payload: any = {
      filterCriteriaMap: {
        status: "Active",
      },
      requestedFields: ["designation", "id"],
      pageSize: pagination.pageSize || this.accessControlConfig()?.accessControlCriteriaSelection?.paginationLimit || PAGINATION_LIMIT,
      pageNumber: pagination.pageNumber || 0,
      // orderDirection: "ASC",
    };
    if (selectedData?.length) {
      payload.filterCriteriaMap.designation = selectedData;
      characterSearch = "";
    }
    if (query) {
      payload.searchString = query;
    }
    if (characterSearch && characterSearch !== '#' && !query) {
      payload.startsWith = characterSearch;
    }
    if (!query) {
      payload.orderBy = "designation";
    }
    return this.http.post<any>(ENDPOINTS.DESIGNATION_LIST, payload);
  }

  fetchDesignationsWithOrg(paginationOffset: number, categories: string[], query: string, selectedData?: string[], characterSearch?: string): Observable<any> {
    let payload: any = {
      request: {
        filters: {
          status: "Live",
          category: "designation",
          categories: categories,
          objectType: "Term",
        },
        fields: ["identifier", "name"],
        query: query,
        sort_by: { name: "asc" },
        facets: [],
        limit: this.accessControlConfig()?.accessControlCriteriaSelection?.paginationLimit || PAGINATION_LIMIT,
        offset: paginationOffset,
      },
    };
    if (selectedData?.length) {
      payload.request.filters.name = selectedData;
    }
    if (characterSearch && characterSearch !== '#' && !query) {
      if (!payload.request.filters.name || typeof payload.request.filters.name !== "object") {
        payload.request.filters.name = {};
      }
      payload.request.filters.name.startsWith = characterSearch;
    }
    return this.http.post<any>(ENDPOINTS.SEARCH_V4, payload);
  }

  applyUserGroupAccessControl(request: IUserGroupRequest): Observable<any> {
    return this.http.put<any>(ENDPOINTS.CREATE_USERGROUPS_CONTROL, request);
  }

  createReusableUserGroup(request: IReusableUserGroupRequest): Observable<any> {
    return this.http.post<any>(ENDPOINTS.CREATE_REUSABLE_USER_GROUP, request);
  }

  updateReusableUserGroup(request: IReusableUserGroupRequest): Observable<any> {
    return this.http.patch<any>(ENDPOINTS.UPDATE_REUSABLE_USER_GROUP, request);
  }

  searchReusableUserGroups(request: IReusableUserGroupSearchRequest): Observable<IReusableUserGroupSearchResponse> {
    return this.http.post<IReusableUserGroupSearchResponse>(ENDPOINTS.SEARCH_REUSABLE_USER_GROUPS, { request });
  }

  fetchReusableUserGroup(userGroupId: string): Observable<IReusableUserGroupReadResponse> {
    return this.http.get<IReusableUserGroupReadResponse>(ENDPOINTS.READ_REUSABLE_USER_GROUP(userGroupId));
  }

  fetchUserGroupAccessControl(id: string): Observable<any> {
    return this.http.get<any>(ENDPOINTS.GET_ACCESS_CONTROL(id));
  }

  updateContentV3(meta: any, id: string): Observable<any> {
    return this.http.patch<any>(`${ENDPOINTS.ACTION_CONTENT_V3}update/${id}`, meta);
  }

  updateContentV4(meta: any, id: string): Observable<any> {
    return this.http.patch<any>(`${ENDPOINTS.PRIVATE_CONTENT_V4}update/${id}`, meta);
  }

  downloadFile(data: any, filename = "data") {
    const csvData = this.convertToCSV(data, ["email", "status", "mobile", "message"]);
    const blob = new Blob([`\ufeff${csvData}`], { type: "text/csv;charset=utf-8;" });
    const dwldLink = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
    if (isSafariBrowser) {
      // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", `${filename}.csv`);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  convertToCSV(objArray: any, headerList: any) {
    const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "S.No,";

    for (const index in headerList) {
      if (headerList[index]) {
        row += `${headerList[index]} ,`;
      }
    }
    row = row.slice(0, -1);
    str += `${row}\r\n`;
    // for (let i = 0; i < array.length; i += 1) {
    for (const iIndex in array) {
      if (array[iIndex]) {
        let line = `${toNumber(iIndex) + 1} `;
        for (const index in headerList) {
          if (headerList[index]) {
            const head = headerList[index];

            line += `, ${array[iIndex][head]}`;
          }
        }
        str += `${line}\r\n`;
      }
    }
    return str;
  }

  createRequestContent(apiResponse: any, accessSettingsEnabled: boolean) {
    return {
      request: {
        content: {
          versionKey: apiResponse.versionKey || "",
          accessSettingsEnabled: accessSettingsEnabled || false,
        },
      },
    };
  }

  createRequesForMDOContent(apiResponse: any, accessSettingsEnabled: boolean, secureSettings: any) {
    return {
      request: {
        content: {
          versionKey: apiResponse.versionKey || "",
          accessSettingsEnabled: accessSettingsEnabled || false,
          secureSettings: secureSettings || null,
        },
      },
    };
  }

  fetchCustomsField(filterCriteria: any): Promise<any> {
    const requestPayload = {
      filterCriteriaMap: filterCriteria,
      requestedFields: ["name", "isActive", "createdBy", "createdOn", "isEnabled", "isMandatory", "customFieldData", "originalCustomFieldData", "attributeName", "type", "reversedOrderCustomFieldData"],
      pageNumber: 0,
      pageSize: this.accessControlConfig()?.accessControlCriteriaSelection?.paginationLimit || PAGINATION_LIMIT,
      orderDirection: "DESC",
      orderBy: "createdOn",
      facets: [],
    };
    return this.http.post<any>(ENDPOINTS.CUSTOMES_FIELD_SEARCH, requestPayload).toPromise()
  }

  enableDeputation(value: boolean) {
    const config = this.accessControlConfig();
    if (config) {
      const centralDeputationOption = { disabled: false, value: NsAccessControlConfig.SelectionType.CentralDeputation, label: "Central Deputation" };
      const centralDeputationCriteria = [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ];
      // Add if true, remove if false
      if (value) {
        // Add to optionsEntity if not present
        if (!config.accessControlCriteriaSelection.optionsEntity.some((o: any) => o.value === NsAccessControlConfig.SelectionType.CentralDeputation)) {
          config.accessControlCriteriaSelection.optionsEntity.push(centralDeputationOption);
        }
        // Add to accessControlCriteriaSelection if not present
        if (!config.accessControlCriteriaSelection.centralDeputation) {
          config.accessControlCriteriaSelection.centralDeputation = centralDeputationCriteria;
        }
      } else {
        // Remove from optionsEntity
        config.accessControlCriteriaSelection.optionsEntity = config.accessControlCriteriaSelection.optionsEntity.filter((o: any) => o.value !== NsAccessControlConfig.SelectionType.CentralDeputation);
        // Remove from accessControlCriteriaSelection
        if (config.accessControlCriteriaSelection.centralDeputation) {
          delete config.accessControlCriteriaSelection.centralDeputation;
        }
      }
      // Update Signal Value
      this.accessControlConfig.set({ ...config });
    }
  }
}
