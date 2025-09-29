import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { RoleMapping, Ministry, Sector } from '../models/role-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class RoleMappingService {
  private roleMappingsSubject = new BehaviorSubject<RoleMapping[]>([]);
  public roleMappings$ = this.roleMappingsSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  getMinistries(): Observable<Ministry[]> {
    const mockMinistries: Ministry[] = [
      { id: '1', name: 'Ministry of Education', code: 'MOE' },
      { id: '2', name: 'Ministry of Health & Family Welfare', code: 'MOHFW' },
      { id: '3', name: 'Ministry of Defence', code: 'MOD' },
      { id: '4', name: 'Ministry of Home Affairs', code: 'MHA' },
      { id: '5', name: 'Ministry of External Affairs', code: 'MEA' },
      { id: '6', name: 'Ministry of Finance', code: 'MOF' },
      { id: '7', name: 'Ministry of Railways', code: 'MOR' },
      { id: '8', name: 'Ministry of Road Transport & Highways', code: 'MORTH' }
    ];
    return of(mockMinistries);
  }

  getSectors(ministryId?: string): Observable<Sector[]> {
    const mockSectors: Sector[] = [
      { id: '1', name: 'School Education', code: 'SE', ministryId: '1' },
      { id: '2', name: 'Higher Education', code: 'HE', ministryId: '1' },
      { id: '3', name: 'Medical Education', code: 'ME', ministryId: '2' },
      { id: '4', name: 'Public Health', code: 'PH', ministryId: '2' },
      { id: '5', name: 'Army', code: 'ARMY', ministryId: '3' },
      { id: '6', name: 'Navy', code: 'NAVY', ministryId: '3' },
      { id: '7', name: 'Air Force', code: 'AF', ministryId: '3' },
      { id: '8', name: 'Internal Security', code: 'IS', ministryId: '4' },
      { id: '9', name: 'Border Management', code: 'BM', ministryId: '4' },
      { id: '10', name: 'Diplomatic Services', code: 'DS', ministryId: '5' },
      { id: '11', name: 'Economic Affairs', code: 'EA', ministryId: '6' },
      { id: '12', name: 'Revenue', code: 'REV', ministryId: '6' }
    ];

    if (ministryId) {
      return of(mockSectors.filter(sector => sector.ministryId === ministryId));
    }

    return of(mockSectors);
  }

  generateRoleMapping(roleMapping: RoleMapping): Observable<RoleMapping> {
    const newMapping: RoleMapping = {
      ...roleMapping,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentMappings = this.roleMappingsSubject.value;
    this.roleMappingsSubject.next([...currentMappings, newMapping]);

    return of(newMapping);
  }

  getRoleMappings(): Observable<RoleMapping[]> {
    return this.roleMappings$;
  }

  private loadMockData(): void {
    const mockRoleMappings: RoleMapping[] = [
      {
        id: '1',
        type: 'Ministry',
        ministry: 'Ministry of Education',
        sector: 'Higher Education',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        type: 'State',
        ministry: 'Ministry of Health & Family Welfare',
        sector: 'Public Health',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];

    this.roleMappingsSubject.next(mockRoleMappings);
  }
}