import { Injectable } from '@angular/core';
import { ConfigurationsService } from './configurations.service'

@Injectable({
  providedIn: 'root'
})
export class DomainConfService {
currentHostname = window.location.hostname;
subdomain = this.currentHostname.split('.')[0];
  constructor(
    private configSvc: ConfigurationsService
  ) {

   }

  /**
   * Gets the appropriate CDN host based on domain configuration
   * @param environmentVariable - Environment configuration containing sitePath and cdnContentHost
   * @returns The CDN host URL for the current domain
   */
  getDomainCDNHost(environmentVariable: any): string {
    // Early return for direct hostname match
    if (environmentVariable.sitePath === this.currentHostname) {
      return environmentVariable.cdnContentHost;
    }

    // Handle missing configuration
    if (!this.configSvc.instanceConfig?.domainList) {
      return environmentVariable.cdnContentHost;
    }

    // Get domain-specific CDN host
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.cdnContentHost || environmentVariable.cdnContentHost;
  }

  /**
   * Gets the appropriate app logo based on domain configuration
   * @param environmentVariable - Environment configuration containing sitePath
   * @returns The app logo URL for the current domain
   */
  getDomainAppLogo(environmentVariable: any): string {
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return '';
    }

    // Early return for direct hostname match
    if (environmentVariable.sitePath === this.currentHostname) {
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
   * @param environmentVariable - Environment configuration containing sitePath
   * @returns The redirect path for the current domain
   */
  getDomainRedirectPath(environmentVariable: any): string {
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return '/page/home';
    }

    // Early return for direct hostname match
    if (environmentVariable.sitePath === this.currentHostname) {
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

  getDomainSitePath(environmentVariable: any): string {
    // Handle missing configuration
    if (!this.configSvc?.instanceConfig) {
      return environmentVariable.sitePath;
    }

    // Early return for direct hostname match
    if (environmentVariable.sitePath === this.currentHostname) {
      return environmentVariable.sitePath;
    }

    // Handle missing domain list
    if (!this.configSvc.instanceConfig.domainList) {
      return environmentVariable.sitePath;
    }

    // Get domain-specific redirect path
    const domainData = this.configSvc.instanceConfig.domainList[this.subdomain];
    return domainData?.sitePath || environmentVariable.sitePath;
  }


}
