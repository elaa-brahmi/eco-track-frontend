import { ReportData, ReportSummary } from "@/types/reportType";

export const calculateSummary = (reports: ReportData[]): ReportSummary => {
  return {
    total: reports.length,
    new: reports.filter(r => r.status === 'NEW').length,
    underReview: reports.filter(r => r.status === 'Under_Review').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
  };
};