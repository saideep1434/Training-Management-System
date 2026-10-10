import { DayDetailInterface, LearningPathInterface } from "../interfaces/learning-path";

 
export class DayDetail implements DayDetailInterface {
  dayNumber: number;
  topic: string;
  description: string;
 
  constructor(data: DayDetailInterface) {
    this.dayNumber = data.dayNumber;
    this.topic = data.topic;
    this.description = data.description;
  }
}
 
export class LearningPath implements LearningPathInterface {
  id: number;
  serviceLineName: string;
  totalDurationWeeks: number;
  dayDetails: DayDetail[];
  qualifierDate: Date;
  qualifierDay: number;
  interimDate: Date;
  interimDay: number;
  finalDate: Date;
  finalDay: number;
 
  constructor(data: LearningPathInterface) {
    this.id = data.id;
    this.serviceLineName = data.serviceLineName;
    this.totalDurationWeeks = data.totalDurationWeeks;
    this.dayDetails = data.dayDetails ? data.dayDetails.map(d => new DayDetail(d)) : [];
    this.qualifierDate = new Date(data.qualifierDate);
    this.qualifierDay = data.qualifierDay;
    this.interimDate = new Date(data.interimDate);
    this.interimDay = data.interimDay;
    this.finalDate = new Date(data.finalDate);
    this.finalDay = data.finalDay;
  }
 
  // >>> THIS IS THE CRUCIAL GETTER THAT WAS LIKELY MISSING OR MISSPELLED <<<
  get totalWorkingDays(): number {
    return this.totalDurationWeeks * 5; // Assuming 5 working days per week
  }
 
  // Example of another method you might have
  get formattedQualifierDate(): string {
    return this.qualifierDate.toLocaleDateString();
  }
}