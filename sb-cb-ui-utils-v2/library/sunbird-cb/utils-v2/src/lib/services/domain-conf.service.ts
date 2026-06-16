import { Inject, Injectable } from '@angular/core';
import { ConfigurationsService } from './configurations.service'

// ─── Interfaces (single source of truth) ─────────────────────────────────────

export interface ITenantFeatures {
  /** Optional per-route overrides: { discuss: false } disables only the route guard */
  routes?: { [feature: string]: boolean }
  [feature: string]: boolean | { [feature: string]: boolean } | undefined
}

export interface ITenantConfig {
  type: 'core' | 'internal' | 'external'
  layout: string
  features: ITenantFeatures
  logo?: string
  redirectPath?: string
  cdnContentHost?: string
  sitePath?: string
  karmayogiBharatLink?: string
}

export interface ITenantConfigFile {
  defaultTenant: string
  tenants: { [tenantId: string]: ITenantConfig }
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * DomainConfService  (single source of truth)
 *
 * Combines three responsibilities that used to live in separate files:
 *
 *  1. Tenant resolution  – resolves the tenant key from the current hostname
 *
 *  2. Tenant config      – holds the per-tenant feature flags / layout / type
 *     loaded from globalConfig.applicationConfig.tenants
 *
 *  3. Domain data        – convenience accessors for CDN host, logo, redirect
 *     path, site path etc. keyed by the resolved tenant
 *
 * Inject this service directly anywhere you need tenant or domain information.
 * Interfaces ITenantConfig, ITenantConfigFile, ITenantFeatures are exported
 * from this file and re-exported from the package public-api.
 */
@Injectable({
  providedIn: 'root',
})
export class DomainConfService {

  // ── hostname / tenant ──────────────────────────────────────────────────────

  readonly currentHostname: string = window.location.hostname

  /**
   * Resolved tenant key derived from the current hostname.
   *
   * Resolution order:
   *  1. localhost / 127.0.0.1             → 'localhost'
   *  2. Old format  {tenant}-portal.x.y   → '{tenant}-portal'
   *  3. New format  portal.{tenant}.x.y.z → '{tenant}'
   *  4. Default     portal.x.y.z          → 'portal'
   */
  readonly subdomain: string

  /** Alias: `tenant` is the same as `subdomain`, provided for readability. */
  get tenant(): string { return this.subdomain }

  environment: any

  // ── tenant config state ────────────────────────────────────────────────────

  private _tenantConfigFile: ITenantConfigFile | null = null
  private _currentTenantConfig: ITenantConfig | null = null
  public loaded = false
  defaultLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo_Horizontal.svg'
  defaultRedirectPath = '/page/home'
  constructor(
    private configSvc: ConfigurationsService,
    @Inject('environment') environment: any,
  ) {
    this.environment = environment
    this.subdomain = this.resolveTenant(this.currentHostname)
  }

  // ── default config (lazy getter so env values are resolved after injection) ─

  private get defaultConfig(): ITenantConfig {
    return {
      type: 'core',
      layout: 'default',
      logo: this.environment?.logo || this.defaultLogo,
      redirectPath: this.environment?.redirectPath || '/page/home',
      cdnContentHost: this.environment?.cdnContentHost || 'https://portal.igotkarmayogi.gov.in/',
      sitePath: this.environment?.sitePath || 'portal.igotkarmayogi.gov.in',
      karmayogiBharatLink: this.environment?.karmayogiBharatLink || 'https://igotkarmayogi.gov.in/',
      features: {
        discussion: true,
        network: true,
        events: true,
        leaderboard: true,
        marketplace: true,
        chatbot: true,
        tour: true,
        bottomNav: true,
      },
    }
  }

  // ── 1. Tenant resolution ───────────────────────────────────────────────────

  resolveTenant(hostname: string): string {
    if (!hostname) { return 'portal' }
    const parts = hostname.split('.')
    if (hostname.includes('localhost') || hostname === '127.0.0.1') { return 'localhost' }
    if (parts[0].includes('-portal')) { return parts[0] }
    if (parts[0] === 'portal' && parts.length >= 4) { return parts[1] }
    return parts[0] || 'portal'
  }

  /** True when the resolved tenant is not the main portal */
  isExternalTenantHost(): boolean {
    return this.subdomain !== 'portal' && this.subdomain !== 'localhost'
  }

  // ── 2. Tenant config ───────────────────────────────────────────────────────

  /**
   * Initializes tenant configuration from globalConfig.applicationConfig.
   * Called by InitService once the globalConfig API resolves.
   */
  initFromConfig(applicationConfig: ITenantConfigFile): void {
    if (!applicationConfig) {
      console.warn('DomainConfService: applicationConfig is empty, using defaults')
      return
    }
    this._tenantConfigFile = applicationConfig
    this._currentTenantConfig = this._tenantConfigFile.tenants[this.subdomain] || null

    // Fallback: ?tenant= query param → defaultTenant in config
    if (!this._currentTenantConfig) {
      const debugTenant = new URLSearchParams(window.location.search).get('tenant')
      if (debugTenant && this._tenantConfigFile.tenants[debugTenant]) {
        this._currentTenantConfig = this._tenantConfigFile.tenants[debugTenant]
      } else if (
        this._tenantConfigFile.defaultTenant &&
        this._tenantConfigFile.tenants[this._tenantConfigFile.defaultTenant]
      ) {
        this._currentTenantConfig = this._tenantConfigFile.tenants[this._tenantConfigFile.defaultTenant]
      }
    }
    this.loaded = true
  }

  /** Returns the full tenant configuration for the current tenant */
  getTenantConfig(): ITenantConfig {
    return this._currentTenantConfig || this.defaultConfig
  }

  /** Returns the layout identifier ('default', 'tenant-layout-v1', …) */
  getLayout(): string {
    return this.getTenantConfig().layout || 'default'
  }

  /** Returns the tenant type: 'core' | 'internal' | 'external' */
  getTenantType(): string {
    return this.getTenantConfig().type || 'core'
  }

  /** True when the tenant config declares type = 'external' */
  isExternalTenant(): boolean {
    return this.getTenantType() === 'external'
  }

  /** True when the tenant uses a non-default layout */
  hasTenantLayout(): boolean {
    return this.getLayout() !== 'default'
  }

  /**
   * Checks if a top-level feature flag is enabled for the current tenant.
   * Defaults to true when no config entry exists (safe for existing portal users).
   */
  isFeatureEnabled(feature: string): boolean {
    const config = this.getTenantConfig()
    if (!config.features) { return true }
    const flag = config.features[feature]
    return typeof flag === 'boolean' ? flag : true
  }

  /**
   * Checks the route-level feature flag (features.routes.<feature>).
   * Defaults to true when not specified.
   */
  isFeatureRoutesEnabled(feature: string): boolean {
    const config = this.getTenantConfig()
    if (!config?.features?.routes) { return true }
    return config.features.routes[feature] ?? true
  }

  isFeatureByPageEnabled(pageName: string, feature: string): boolean {
    const config = this.getTenantConfig()
    const pageFeatures = config?.features?.[pageName]
    if (!pageFeatures || typeof pageFeatures !== 'object') {
      return true
    }
    return (pageFeatures as { [feature: string]: boolean })[feature] ?? true
  }

  /** Returns all feature flags for the current tenant */
  getFeatures(): ITenantFeatures {
    return this.getTenantConfig().features || {}
  }

  // ── 3. Domain data accessors ───────────────────────────────────────────────
  //
  // All accessors use getTenantConfig() which returns _currentTenantConfig —
  // the fully-resolved config that already accounts for hostname, ?tenant= param,
  // and defaultTenant fallback. This ensures consistency: if you land on localhost
  // with ?tenant=iiidem-portal, both feature flags AND domain data return iiidem
  // values, not localhost/environment fallbacks.

  getDomainCDNHost(): string {
    return this.getTenantConfig().cdnContentHost || this.environment?.cdnContentHost
  }

  getDomainAppLogo(): string {
    const tenantLogo = this.getTenantConfig().logo
    if (tenantLogo) { return tenantLogo }
    return this.configSvc?.instanceConfig?.logos?.app || this.defaultLogo
  }

  getDomainRedirectPath(): string {
    return this.getTenantConfig().redirectPath || this.environment?.redirectPath|| this.defaultRedirectPath
  }

  getDomainSitePath(): string {
    return this.getTenantConfig().sitePath || this.environment?.sitePath 
  }

  /** True when the current domain is the main KB portal (not a tenant portal) */
  isKbPortal(): boolean {
    return this.environment?.sitePath === this.getDomainSitePath()
  }

  getNonLoggedInPageUrl(): string {
    return this.getTenantConfig().karmayogiBharatLink
      || this.environment?.karmayogiBharatLink
      || 'https://igotkarmayogi.gov.in/'
  }

  /** Returns the resolved tenant config data (logo, redirectPath, cdnContentHost, etc.) */
  getDomainData(): any {
    return this.getTenantConfig()
  }

  // ── 4. Global config accessors (from assets/configurations/global-config.json) ─
  //
  // These read from configSvc.globalConfig which is loaded by InitService
  // at startup from the static JSON file.

  /** Returns the entire globalConfig object */
  getGlobalConfig(): any {
    return this.configSvc.globalConfig || {}
  }

  /**
   * Single method to check if a specific element is enabled in a given section of globalConfig.
   *
   * Usage:
   *   domainConfSvc.isConfigEnabled('components.header', 'notification')
   *   domainConfSvc.isConfigEnabled('components.footer', 'downloadApp')
   *   domainConfSvc.isConfigEnabled('featureFlags', 'chatbot')
   *
   * @param sectionKey - dot-notation path to the section (e.g. 'components.header', 'featureFlags')
   * @param elementKey - the property name within that section (e.g. 'notification', 'language')
   * @returns true if the value is not explicitly false; defaults to true when not specified
   */
  isConfigEnabled(sectionKey: string, elementKey: string): boolean {
    const config = this.getGlobalConfig()
    const section = sectionKey.split('.').reduce((obj: any, key: string) => obj?.[key], config)
    if (!section || section[elementKey] === undefined) { return true }
    return section[elementKey] !== false
  }

  // ── 5. Search Categories config ────────────────────────────────────────────

  /**
   * Returns the searchCategories config from globalConfig.components.searchCategories.
   * Returns null if not configured.
   */
  getSearchCategoriesConfig(): any {
    return this.getGlobalConfig()?.components?.searchCategories || null
  }

  /**
   * Checks if the search categories feature is enabled overall.
   * Defaults to true when not configured.
   */
  isSearchCategoriesEnabled(): boolean {
    const config = this.getSearchCategoriesConfig()
    if (!config) { return true }
    return config.enabled !== false
  }

  /**
   * Checks if a specific search category is enabled.
   * Defaults to true when not configured or when the category key is not specified.
   *
   * @param categoryValue - the category value (e.g. 'courses', 'events', 'peoples', 'all')
   */
  isSearchCategoryEnabled(categoryValue: string): boolean {
    const config = this.getSearchCategoriesConfig()
    if (!config) { return true }
    const key = categoryValue || 'all'
    return config[key] !== false
  }

  // ── 6. Feature API config accessors ────────────────────────────────────────

  /**
   * Generic method to get an API URL from globalConfig.apis section.
   * Returns the configured URL only if enabled is true.
   * Returns empty string if the API is disabled (enabled: false).
   * Falls back to defaultUrl if not configured in global-config.json.
   *
   * Usage:
   *   domainConfSvc.getApiUrl('search', 'searchV4', '/apis/proxies/v8/sunbirdigot/v4/search')
   *   domainConfSvc.getApiUrl('search', 'volunteerSearch', '/apis/proxies/v8/sunbirdigot/v4/search')
   *   domainConfSvc.getApiUrl('user', 'profile', '/apis/proxies/v8/api/user/v2/read')
   *   domainConfSvc.getApiUrl('content', 'explore', '/api/course/v1/explore')
   *
   * @param service - the service group key (e.g. 'search', 'user', 'content')
   * @param apiKey - the specific API key within the service group
   * @param defaultUrl - fallback URL if not found in config
   * @returns API URL if enabled, empty string if disabled, defaultUrl if not configured
   */
  getApiUrl(service: string, apiKey: string, defaultUrl: string = ''): string {
    const apis = this.getGlobalConfig()?.apis
    const apiConfig = apis?.[service]?.[apiKey]
    
    // If not configured in global-config.json, return defaultUrl
    if (!apiConfig) { return defaultUrl }
    
    // Legacy support: if apiConfig is a string, return it directly
    if (typeof apiConfig === 'string') { return apiConfig }
    
    // New format: check enabled flag
    // If enabled is false, return empty string (API is disabled)
    if (apiConfig.enabled === false) { return '' }
    
    // If enabled is true or not specified, return the URL
    return apiConfig.url || defaultUrl
  }

  /**
   * Checks if a specific API is enabled in globalConfig.apis.
   * Returns true if the API is enabled or not configured.
   * Returns false if explicitly disabled (enabled: false).
   *
   * @param service - the service group key (e.g. 'search', 'user', 'content')
   * @param apiKey - the specific API key within the service group
   * @returns true if enabled, false if disabled
   */
  isApiEnabled(service: string, apiKey: string): boolean {
    const apis = this.getGlobalConfig()?.apis
    const apiConfig = apis?.[service]?.[apiKey]
    
    // If not configured, assume enabled
    if (!apiConfig) { return true }
    
    // Legacy support: if apiConfig is a string, it's enabled
    if (typeof apiConfig === 'string') { return true }
    
    // New format: check enabled flag (default to true if not specified)
    return apiConfig.enabled !== false
  }

  /**
   * Generic accessor for any feature config under globalConfig.features.
   * @param featureKey - the key under features (e.g. 'volunteerSearch', 'home', 'explore')
   */
  getFeatureConfig(featureKey: string): any {
    return this.getGlobalConfig()?.features?.[featureKey] || null
  }

  /**
   * Checks if a feature is enabled in globalConfig.features.<featureKey>.enabled.
   * Defaults to true when not configured.
   */
  isGlobalFeatureEnabled(featureKey: string): boolean {
    const config = this.getFeatureConfig(featureKey)
    if (!config) { return true }
    return config.enabled !== false
  }

}
