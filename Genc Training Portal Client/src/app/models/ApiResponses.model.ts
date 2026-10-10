import { BhTrainer } from "./BhTrainer.model";
import { Coach } from "./coach.model";
import { Cohort } from "./class/cohort.model";
import { Domain } from "./domain.model";
import { HireType } from "./hiretype.model";
import { LearningPath, LearningPathOption } from "./learningPath.model";
import { Mentor } from "./Mentor.model";
import { TechTrainer } from "./TechTrainer.model";
import { Trainee } from "./class/trainee.model";
import { vertical } from "./vertical.model";
import { ServiceLine } from "./serviceLine.model";
import { Location } from "./location.model";
import { Associate, Person } from "./Person.model";

export interface CommonCreateResponse {
  status: number;
  message: string;
}

export interface TechTrainerApiResponse {
  status: number;
  message: string;
  technicalTrainerList: TechTrainer[];
}

export interface MentorApiResponse {
  status: number;
  message: string;
  mentorList: Mentor[];
}

export interface BhTrainerApiResponse {
  status: number;
  message: string;
  bhTrainerList: BhTrainer[];
}

export interface CoachApiResponse {
  status: number;
  message: string;
  coachs: Coach[];
}

export interface LearningPathApiResponse {
  status: number;
  message: string;
  learningPaths: LearningPathOption[];
}

export interface domainApiResponse {
  status: number;
  message: string;
  domainNameList: Domain[];
}

export interface verticalApiResponse {
  status: number;
  message: string;
  verticalList: vertical[]
}

export interface HireTypeApiResponse {
  status: number;
  message: string;
  hireTypeList: HireType[]
}

export interface CohortApiResponse {
  status: number;
  message: string;
  cohortList: Cohort[];
}

export interface cohortCreateApiResponse {
  status: number;
  message: string;
  cohort: Cohort;
}



export interface SingleCohortApiResponse {
  status: number;
  message: string;
  cohort: Cohort;
}


export interface serviceLineApiResponse {
  status: number;
  message: string;
  serviceLines?: ServiceLine[];
}

export interface locationApiResponse{
  status: number;
  message: string;
  locations: Location[];
}

export interface PersonApiResponse {
  status : number;
  message: string;
  registeredAssociates: Associate[];
}

export interface AddAssociateApiResponse {
  status: number;
  message: string;
  registeredAssociate: Associate;
}

export interface TraineeApiResponse {
  status: number;
  message: string;
  traineeList: Trainee[];
}

// export interface UpdateAssociateApiResponse {
//   status: number;
//   message: string;
//   registeredAssociate: Associate;
// }
