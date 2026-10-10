
export class Trainee {
    no: number;
    name: string;
    candidateId: string;
    qualifier: 'dot' | 'tick' | 'cross'; // Represents status with specific literal values
    interim: 'dot' | 'tick' | 'cross';   // Represents status with specific literal values
    final: 'dot' | 'tick' | 'cross';     // Represents status with specific literal values
    dayOfBoarding: string; // Consider using `Date` type for date operations
    email: string;
    tekstack: string;
    status: string;       // e.g., 'In training', 'Completed'
    presentAbsent: 'Present' | 'Absent'; // Represents attendance status
    avatar: string;       // URL path to the avatar image
  
    /**
     * Constructs a new Trainee instance.
     * @param data An object containing partial data to initialize the instance.
     * This allows for flexible instantiation, providing only the properties needed.
     */
    constructor(data: Partial<Trainee>) {
      // Assigns all properties from the provided data object to the current instance.
      Object.assign(this, data);
    }
  }
    