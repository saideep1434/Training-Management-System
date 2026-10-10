export class CohortMember {
    id: string; // Unique identifier for the cohort member
    name: string;
    role: string; // e.g., 'Tech Trainer', 'BH Trainer', 'Coach', 'Mentor'
    avatar: string; // URL path to the avatar image
    badge: number; // A numeric badge, such as an employee ID or a related count
  
    /**
     * Constructs a new CohortMember instance.
     * @param data An object containing partial data to initialize the instance.
     * This allows for flexible instantiation, providing only the properties needed.
     */
    constructor(data: Partial<CohortMember>) {
      // Assigns all properties from the provided data object to the current instance.
      Object.assign(this, data);
    }
  }