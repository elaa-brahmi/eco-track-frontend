export interface ReportData {
  file: File
  description: string
  location: [number, number]
  photoUrl?: string;
  id?:string;
  status?:string; 
  type ?:string;
  createdAt ?:string;
}
export type ReportStatus = 'NEW' | 'Under_Review' | 'RESOLVED';
export type ReportTypee = 'Sanitation_problem' | 'Overflow' | 'Organic_waste_issue';
export interface ReportSummary {
  total: number;
  new: number;
  underReview: number;
  resolved: number;
}