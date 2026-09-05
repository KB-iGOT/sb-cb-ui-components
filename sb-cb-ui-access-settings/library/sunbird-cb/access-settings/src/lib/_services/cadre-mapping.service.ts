import { Injectable } from "@angular/core";
export interface ICadre {
  id: string;
  name: string;
  startBatchYear: number;
  endBatchYear: number;
}

export interface ICivilService {
  id: string;
  name: string;
  displayName?: string;
  commonBatchStartYear: number;
  commonBatchEndYear: number;
  cadreList?: ICadre[];
}

/** A State Service type groups its services one level deeper, per state. */
export interface ICivilServiceState {
  id: string;
  name: string;
  displayName?: string;
  serviceList?: ICivilService[];
}

export interface ICivilServiceType {
  id: string;
  name: string;
  displayName?: string;
  /** Present on the central / all india types */
  serviceList?: ICivilService[];
  /** Present on the State Service type instead of serviceList */
  states?: ICivilServiceState[];
}

export interface IStateOption {
  /** Key scoped with the civil service type, used to look the state services up */
  id: string;
  /** Raw id as published in the config */
  stateId: string;
  name: string;
  displayName: string;
  typeId: string;
  typeName: string;
}

interface CivilServiceData {
  civilServiceType: {
    civilServiceTypeList: ICivilServiceType[];
  };
}

@Injectable({
  providedIn: "root",
})
export class CadreMappingService {
  private allCadres = new Map<string, any>();
  private allServices = new Map<string, any>();
  private cadreToServiceMap = new Map<string, Set<string>>();
  private serviceToCadresMap = new Map<string, Set<string>>();
  private batchYearToCadresMap = new Map<number, Set<string>>();
  private batchYearToServicesMap = new Map<number, Set<string>>();
  private allStates = new Map<string, IStateOption>();
  private stateToServicesMap = new Map<string, Set<string>>();

  private cadreConfigData: CivilServiceData | null = null;

  private addToMapSet(map: Map<any, Set<any>>, key: any, value: any) {
    if (!map.has(key)) {
      map.set(key, new Set());
    }
    map.get(key)?.add(value);
  }

  private buildTypeKey(cst: ICivilServiceType): string {
    return `${cst?.id || cst?.name}`;
  }

  private buildStateKey(cst: ICivilServiceType, state: ICivilServiceState): string {
    return `${this.buildTypeKey(cst)}_${state?.id || state?.name}`;
  }

  /**
   * Indexes one service list. Service ids are only unique within their own branch of the config:
   * the same id is reused across civil service types (eg. "cs-004" is both a state secretariat
   * service and a central railway service) and could be reused across states. The key is therefore
   * scoped with the civil service type and, for state services, with the state.
   */
  private registerServices(cst: ICivilServiceType, state: ICivilServiceState | null, serviceList?: ICivilService[]) {
    (serviceList || []).forEach(service => {
      if (!service) return;
      const { commonBatchStartYear, commonBatchEndYear } = service;
      const scope = state ? this.buildStateKey(cst, state) : this.buildTypeKey(cst);
      const serviceId = `${scope}_${service.id}`;

      this.allServices.set(serviceId, {
        ...service,
        id: serviceId,
        civilServiceTypeId: cst?.id,
        civilServiceTypeName: cst?.name,
        stateKey: state ? this.buildStateKey(cst, state) : null,
        stateName: state ? state.name : null,
      });

      if (state) {
        this.addToMapSet(this.stateToServicesMap, this.buildStateKey(cst, state), serviceId);
      }

      // Add years to service-batch map
      for (let y = commonBatchStartYear; y <= commonBatchEndYear; y++) {
        this.addToMapSet(this.batchYearToServicesMap, y, serviceId);
      }

      (service.cadreList || []).forEach(cadre => {
        if (!cadre) return;
        const { id: cadreId, startBatchYear, endBatchYear } = cadre;
        this.allCadres.set(cadreId, cadre);

        // Map cadre <-> service
        this.addToMapSet(this.cadreToServiceMap, cadreId, serviceId);
        this.addToMapSet(this.serviceToCadresMap, serviceId, cadreId);

        // Add years to cadre-batch map
        for (let y = startBatchYear; y <= endBatchYear; y++) {
          this.addToMapSet(this.batchYearToCadresMap, y, cadreId);
        }
      });
    });
  }

  initialize(data: CivilServiceData) {
    // Clear existing data
    this.allCadres.clear();
    this.allServices.clear();
    this.cadreToServiceMap.clear();
    this.serviceToCadresMap.clear();
    this.batchYearToCadresMap.clear();
    this.batchYearToServicesMap.clear();
    this.allStates.clear();
    this.stateToServicesMap.clear();

    // Build lookups. A civil service type carries its services either directly on serviceList or,
    // for the State Service type, grouped per state under states[].serviceList. Both are optional.
    (data?.civilServiceType?.civilServiceTypeList || []).forEach(cst => {
      if (!cst) return;

      this.registerServices(cst, null, cst.serviceList);

      (cst.states || []).forEach(state => {
        if (!state) return;
        const stateKey = this.buildStateKey(cst, state);
        this.allStates.set(stateKey, {
          id: stateKey,
          stateId: state.id,
          name: state.name,
          displayName: state.displayName || state.name,
          typeId: cst.id,
          typeName: cst.name,
        });
        this.registerServices(cst, state, state.serviceList);
      });
    });
  }

  /** Civil service types that publish their services per state (eg. "State Service"). */
  getStateServiceTypeNames(): string[] {
    return Array.from(new Set(Array.from(this.allStates.values()).map(state => state.typeName)));
  }

  isStateServiceType(typeName: string): boolean {
    if (!typeName) return false;
    return Array.from(this.allStates.values()).some(state => state.typeName === typeName);
  }

  getAllStates(): IStateOption[] {
    return Array.from(this.allStates.values()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  getStatesByType(typeName: string): IStateOption[] {
    return this.getAllStates().filter(state => state.typeName === typeName);
  }

  /** Case insensitive, the org name is upper cased while the config uses title case. */
  findStateByName(name: string): IStateOption | null {
    if (!name) return null;
    const lowerName = name.trim().toLowerCase();
    return this.getAllStates().find(state => (state.name || "").trim().toLowerCase() === lowerName) || null;
  }

  getServicesByStateKeys(stateKeys: string[]): Array<{ id: string; name: string }> {
    const serviceIdsSet = new Set<string>();
    (stateKeys || []).forEach(stateKey => {
      (this.stateToServicesMap.get(stateKey) || new Set()).forEach(serviceId => serviceIdsSet.add(serviceId));
    });

    return Array.from(serviceIdsSet)
      .map(id => this.allServices.get(id))
      .filter(s => !!s)
      .map(s => ({ id: s.id, name: s.name }));
  }

  getAllBatchYears(): number[] {
    return Array.from(this.batchYearToCadresMap.keys()).sort((a, b) => a - b);
  }

  getAllCadres(): Array<{ id: string; name: string }> {
    return Array.from(this.allCadres.values()).map(c => ({
      id: c.id,
      name: c.name
    }));
  }

  getAllServices(): Array<{ id: string; name: string }> {
    return Array.from(this.allServices.values()).map(s => ({
      id: s.id,
      name: s.name
    }));
  }

  /** Services that are not tied to a state, ie. everything the user may always see. */
  getNonStateServices(): Array<{ id: string; name: string }> {
    return Array.from(this.allServices.values())
      .filter(s => !s.stateKey)
      .map(s => ({ id: s.id, name: s.name }));
  }

  getServicesByCadres(cadreIds: string[]): Array<{ id: string; name: string }> {
    const serviceIdsSet = new Set<string>();
    cadreIds.forEach(cadreId => {
      const services = this.cadreToServiceMap.get(cadreId) || new Set();
      services.forEach(serviceId => serviceIdsSet.add(serviceId));
    });

    return Array.from(serviceIdsSet)
      .map(id => this.allServices.get(id))
      .filter(s => !!s)
      .map(s => ({ id: s.id, name: s.name }));
  }

  getCadresByServices(serviceIds: string[]): Array<{ id: string; name: string }> {
    const cadreIdsSet = new Set<string>();
    serviceIds.forEach(serviceId => {
      const cadres = this.serviceToCadresMap.get(serviceId) || new Set();
      cadres.forEach(cadreId => cadreIdsSet.add(cadreId));
    });

    return Array.from(cadreIdsSet)
      .map(id => this.allCadres.get(id))
      .filter(c => !!c)
      .map(c => ({ id: c.id, name: c.name }));
  }

  getCadresByBatchYears(years: number[]): Array<{ id: string; name: string }> {
    const cadreIdsSet = new Set<string>();
    years.forEach(year => {
      const cadres = this.batchYearToCadresMap.get(year) || new Set();
      cadres.forEach(cadreId => cadreIdsSet.add(cadreId));
    });

    return Array.from(cadreIdsSet)
      .map(id => this.allCadres.get(id))
      .filter(c => !!c)
      .map(c => ({ id: c.id, name: c.name }));
  }

  getServicesByBatchYears(years: number[]): Array<{ id: string; name: string }> {
    const serviceIdsSet = new Set<string>();
    years.forEach(year => {
      const services = this.batchYearToServicesMap.get(year) || new Set();
      services.forEach(serviceId => serviceIdsSet.add(serviceId));
    });

    return Array.from(serviceIdsSet)
      .map(id => this.allServices.get(id))
      .filter(s => !!s)
      .map(s => ({ id: s.id, name: s.name }));
  }

  getServicesByCadresAndBatch(cadreIds: string[], years: number[]): Array<{ id: string; name: string }> {
  const services = this.getServicesByCadres(cadreIds);
  if (!Array.isArray(years)) {
    years = [years];
  }
  return services.filter(service => {
    const fullService = this.allServices.get(service.id);
    if (!fullService) return false;
    // Return true if any year is within the service's batch year range
    return years.some(year => year >= fullService.commonBatchStartYear && year <= fullService.commonBatchEndYear);
  });
}

  getCadresByServicesAndBatch(serviceIds: string[], years: number[]): Array<{ id: string; name: string }> {
    const cadres = this.getCadresByServices(serviceIds);
    if (!Array.isArray(years)) {
      years = [years];
    }
    return cadres.filter(cadre => {
      const fullCadre = this.allCadres.get(cadre.id);
      if (!fullCadre) return false;
      // Return true if any year is within the cadre's batch year range
      return years.some(year => year >= fullCadre.startBatchYear && year <= fullCadre.endBatchYear);
    });
  }

  getBatchYearsByCadres(cadreIds: string[]): number[] {
    const batchYearsSet = new Set<number>();
    cadreIds.forEach(cadreId => {
      const cadre = this.allCadres.get(cadreId);
      if (cadre) {
        for (let y = cadre.startBatchYear; y <= cadre.endBatchYear; y++) {
          batchYearsSet.add(y);
        }
      }
    });
    return Array.from(batchYearsSet).sort((a, b) => a - b);
  }

  getBatchYearsByServices(serviceIds: string[]): number[] {
    const batchYearsSet = new Set<number>();
    serviceIds.forEach(serviceId => {
      const service = this.allServices.get(serviceId);
      if (service) {
        for (let y = service.commonBatchStartYear; y <= service.commonBatchEndYear; y++) {
          batchYearsSet.add(y);
        }
      }
    });
    return Array.from(batchYearsSet).sort((a, b) => a - b);
  }

  getBatchYearsByServicesAndCadres(serviceIds: string[], cadreIds: string[]): number[] {
    const serviceYears = this.getBatchYearsByServices(serviceIds);
    const cadreYears = this.getBatchYearsByCadres(cadreIds);

    // Find intersection of years
    const commonYears = serviceYears.filter(year => cadreYears.includes(year));
    return commonYears.sort((a, b) => a - b);
  }

  getCadreIdsByName(names: string[]) {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map(n => n?.toLowerCase());
    return Array.from(this.allCadres.values())
      .filter(cadre => lowerNames.includes(cadre?.name?.toLowerCase()))
      .map(cadre => cadre.id);
  }

  getServiceIdsByName(names: string[]) {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map((n) => n?.toLowerCase());
    return Array.from(this.allServices.values())
      .filter((service) => lowerNames.includes(service?.name?.toLowerCase()))
      .map((service) => service.id);
  }

  setCadreConfigData(data: CivilServiceData) {
    this.cadreConfigData = data;
  }

  getCadreConfigData(): CivilServiceData | null {
    return this.cadreConfigData;
  }

  getServicesByNames(names: string[]): Array<{ id: string; name: string }> {
    if (!Array.isArray(names)) names = [names];
    const lowerNames = names.map((n) => n?.toLowerCase());
    const uniqueMap = new Map<string, { id: string; name: string }>();
    const cadreConfig = this.getCadreConfigData();
    if (cadreConfig) {
      (cadreConfig.civilServiceType?.civilServiceTypeList || []).forEach((cst) => {
        (cst?.serviceList || []).forEach((service) => {
          if (lowerNames.includes(service?.name?.toLowerCase())) {
            if (!uniqueMap.has(cst.id)) {
              uniqueMap.set(cst.id, { id: cst.id, name: cst.name });
            }
          }
        });
      });
    }
    return Array.from(uniqueMap.values());
  }
}
