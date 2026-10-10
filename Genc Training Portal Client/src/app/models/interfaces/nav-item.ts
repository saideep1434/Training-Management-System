// export interface NavItem {
//     displayName?: string;
//     disabled?: boolean;
//     external?: boolean;
//     twoLines?: boolean;
//     chip?: boolean;
//     iconName?: string;
//     navCap?: string;
//     chipContent?: string;
//     chipClass?: string;
//     subtext?: string;
//     route?: string;
//     children?: NavItem[];
//     ddType?: string;
// }

// src/app/models/interfaces/nav-item.ts
import { RoleValue } from '../../shared/constants/roles'; // Import RoleValue

export interface NavItem {
  navCap?: string;
  displayName?: string;
  iconName?: string;
  route?: string;
  children?: NavItem[];
  // Add the allowedRoles property
  allowedRoles?: RoleValue[];
  // Add other properties you might have
  external?: boolean;
  twoLines?: boolean;
}