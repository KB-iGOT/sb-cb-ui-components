import { Inject, Injectable } from '@angular/core';
import { ConfigurationsService } from './configurations.service'


@Injectable({
  providedIn: 'root'
})
export class DomainConfService {
currentHostname = window.location.hostname;
subdomain = this.currentHostname.split('.')[0];
environment: any;
  constructor(
    private configSvc: ConfigurationsService,
  @Inject('environment') environment: any) {
      this.environment = environment
    }

  /**
   * Gets the appropriate CDN host based on domain configuration

   * @returns The CDN host URL for the current domain
   */
  getDomainCDNHost(): string {
    // Early return for direct hostname match
    if (this.environment?.sitePath === this.currentHostname) {
      return this.environment?.cdnContentHost;
    }

    // Handle missing configuration
    if (!this.configSvc.instanceConfig?.domainList) {
      return this.environment?.cdnContentHost;
    }

    // Get domain-specific CDN host
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.cdnContentHost || this.environment?.cdnContentHost;
  }

  /**
   * Gets the appropriate app logo based on domain configuration
   * @returns The app logo URL for the current domain
   */
  getDomainAppLogo(): string {
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return '';
    }

    // Early return for direct hostname match
    if (this.environment?.sitePath === this.currentHostname) {
      return this.configSvc.instanceConfig.logos.app;
    }

    // Handle missing domain list
    if (!this.configSvc.instanceConfig.domainList) {
      return this.configSvc.instanceConfig.logos.app;
    }

    // Get domain-specific logo
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.logo || this.configSvc.instanceConfig.logos.app;
  }

  /**
   * Gets the appropriate redirect path based on domain configuration
   * @returns The redirect path for the current domain
   */
  getDomainRedirectPath(): string {
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return '/page/home';
    }

    // Early return for direct hostname match
    if (this.environment?.sitePath === this.currentHostname) {
      return '/page/home';
    }

    // Handle missing domain list
    if (!this.configSvc.instanceConfig.domainList) {
      return '/page/home';
    }

    // Get domain-specific redirect path
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.redirectPath || '/page/home';
  }

  getDomainSitePath(): string {
    debugger
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return this.environment?.sitePath;
    }

    // Early return for direct hostname match
    if (this.environment?.sitePath === this.currentHostname) {
      return this.environment?.sitePath;
    }

    // Handle missing domain list
    if (!this.configSvc.instanceConfig.domainList) {
      return this.environment?.sitePath;
    }

    // Get domain-specific redirect path
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.sitePath || this.environment?.sitePath;
  }

  /**
   * Determines if the current domain is a same portal or client portal
   * @returns Boolean indicating if it's a same portal (true) or client portal (false)
   */
  isKbPortal(): boolean {
    // Check if environment sitePath matches current hostname
    const domainData = this.getDomainData();
    return this.environment.sitePath === domainData.sitePath;
  }

  getDomainData(): any {
    const defaultDomainData = {
      "logo": "/assets/instances/eagle/app_logos/KarmayogiBharat_Logo_Horizontal.svg",
      "redirectPath": "/page/home",
      "cdnContentHost": this.environment?.cdnContentHost || "https://portal.qa.karmayogibharat.net",
      "sitePath": this.environment?.sitePath || "portal.qa.karmayogibharat.net"
    }
    return this.configSvc.instanceConfig?.domainList?.[this.subdomain] || defaultDomainData;
  }
}
