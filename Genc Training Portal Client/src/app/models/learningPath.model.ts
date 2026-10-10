import { Cohort } from "./class/cohort.model"


export class LearningPath {
    totalDurationWeeks: number
    serviceLineName: string
    dayDetails : DayDetails[]
}

export interface DayDetails {
    dayNumber: number
    topic: string
    description: string
}

export interface LearningPathOption {
    learningPathId: number
    durationWeeks: number
    serviceLineName: string
    dayDetails : DayDetails[] 
}

export interface LearningPathOptionsResponse {
    status: number
    message: string
    learningPaths: LearningPathOption[]
}

export interface LearningPathByIdResponse{
    status: number;
    message: string;
    learningPath: LearningPathOption;
    
}