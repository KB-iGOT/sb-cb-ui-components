export interface RoleMapping {
  id?: string;
  type: 'Centre' | 'State' | 'Ministry';
  ministry?: string;
  sector?: string;
  additionalDetails?: string; // New field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Ministry {
  id: string;
  name: string;
  code: string;
}

export interface Sector {
  id: string;
  name: string;
  code: string;
  ministryId?: string;
}

export interface RoleMappingForm {
  type: string;
  ministry: string;
  sector: string;
  additionalDetails?: string; // New field
}