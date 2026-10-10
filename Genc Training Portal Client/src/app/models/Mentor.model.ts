export class Mentor {
    id: number;
    mentorAssociateId: number;
    mentorName: string;
    mentorEmail: string;
    cohorts: number;
    description: string;
    status: 'assigned' | 'free';
}

export interface MentorAdd {
    mentorAssociateId: string;
    mentorName : string;
    mentorEmail : string;
}