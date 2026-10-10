export class BhTrainer {
    id: number;
    bhTrainerAssociateId: number;
    bhTrainerName: string;
    bhTrainerEmail: string;
    cohorts: number;
    description: string;
    status: 'assigned' | 'free';
    constructor(id: number, associateId: number, name: string, email: string, cohorts: number, description: string) { }
}

export interface BhtrainerAdd {
    bhTrainerAssociateId: string;
    bhTrainerName: string;
    bhTrainerEmail: string
}