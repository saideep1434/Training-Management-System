export class DayDetail {
    dayNumber: number;
    topic: string;
    description: string;
 
    constructor(data: { dayNumber: number; topic: string; description: string }) {
      this.dayNumber = data.dayNumber;
      this.topic = data.topic;
      this.description = data.description;
    }
 
    // You can add methods specific to a DayDetail here if needed
    // getSummary(): string {
    //   return `Day ${this.dayNumber}: ${this.topic} - ${this.description}`;
    // }
  }