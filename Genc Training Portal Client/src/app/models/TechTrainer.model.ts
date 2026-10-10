import { Optional } from "@angular/core"

export class TechTrainer {
    // Backend DTO uses 'technialTrainerId' (note spelling), keep both for compatibility
    id?: number;
    technialTrainerId?: number;
    techTrainerAssociateId: string; // backend sends string
    techTrainerName: string;
    techTrainerEmail: string;
    status?: string;
    cohorts?: number;
    description?: string;
    constructor(id?: number, associateId?: string, name?: string, email?: string, status?: string, cohorts?: number, description?: string) {
        this.id = id;
        this.techTrainerAssociateId = associateId || '';
        this.techTrainerName = name || '';
        this.techTrainerEmail = email || '';
        this.status = status;
        this.cohorts = cohorts;
        this.description = description;
    }
}

export interface TechTrainerAdd {
    techTrainerAssociateId: string
    techTrainerName: string
    techTrainerEmail: string
    description: string
}

export interface TechTrainerOptionsModel {
    status: number;
    message: string;
    trainerOptions: [string, string][];
}