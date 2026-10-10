
// src/app/models/Person.model.ts
import { RoleValue } from '../shared/constants/roles';

export interface Associate {
  id: string;
  associateId: string;
  associateName: string;
  associateEmail: string;
  role: RoleValue;
  // Make this property optional (using ?) and allow it to be string or null
  description?: string | null;
}

export interface AssociateForRequest {
  associateEmail: string | null,
  role: string | null
}

// Keep Person interface if it's still used elsewhere, otherwise consider removing it.
export interface Person {
  fullName: string;
  id: string;
  emailId: string;
  role: RoleValue;
}