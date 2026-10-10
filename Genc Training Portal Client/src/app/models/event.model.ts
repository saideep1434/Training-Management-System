export enum EventType {
  TRAINER_CONNECT = 'TRAINER_CONNECT',
  MENTOR_CONNECT = 'MENTOR_CONNECT',
  COACH_CONNECT = 'COACH_CONNECT',
  BH_TRAINER_CONNECT = 'BH_TRAINER_CONNECT',
  PROJECT = 'PROJECT',
  MEETING = 'MEETING'
}

export interface EventModel {
  id?: number;
  cohortId: number;                  // ✅ matches backend
  eventCreatorAssociateId: string;
  type: EventType;                   // ✅ enum
  date: string;                      // yyyy-MM-dd
  description: string;
  startHour: number;
  endHour: number;
}
