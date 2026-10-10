export class Coach {
    id?: number;
    coachAssociateId: string;
    coachName: string;
    coachEmail: string;
    cohorts?: number;
    description?: string;

    constructor(id?: number, associateId?: string, name?: string, email?: string, cohorts?: number, description?: string){
        this.id = id;
        this.coachAssociateId = associateId || '';
        this.coachName = name || '';
        this.coachEmail = email || '';
        this.cohorts = cohorts;
        this.description = description;
    }
}

export interface CoachAdd {
    coachName: string
    coachEmail: string
    coachAssociateId: string
}