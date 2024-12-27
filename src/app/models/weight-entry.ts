export interface WeightEntry {
  id?: number;
  date: Date;
  weight: number;
  // Making bmi optional since it's calculated
  bmi?: number;
  // Adding notes for future enhancement
  notes?: string;
}
