// Define the Cohort model
export class Cohort {
    cohortId: string;
    cohortCode: string;
    domainName: string;
    technicalTrainerName: string;
    coachName: string;
    mentorName : string;
    bhTrainerName: string;
    location: string;
    hireType: string;
    vertical: string;
    serviceLine: string;
    learningPathId: string;
    dateOfJoining: string;
    trainingStartDate: string
    trainingEndDate: string;
}

  export interface FilterOption {
    label: string;
    value: string;
  }