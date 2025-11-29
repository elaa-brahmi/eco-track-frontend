import { TaskRequirement } from "./TaskRequirement";

export interface ResolveReportRequest {
    taskTitle: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    requirement: TaskRequirement;
    start: string; // ISO date string
    end: string;   // ISO date string
}