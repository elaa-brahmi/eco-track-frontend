import { useMemo, useState } from "react";
import { ReportCard } from "./ReportCard";
import { ReportData } from "@/types/reportType";

interface FilterBarAndReportsProps {
  allReports: ReportData[];
  onReportSelect: (report: ReportData) => void;
}

/**
 * Handles filtering logic and displays the filtered list of ReportCards.
 */
export const FilterBarAndReports: React.FC<FilterBarAndReportsProps> = ({ allReports, onReportSelect }) => {
  const [reportType, setReportType] = useState<string>('All Types');
  const [status, setStatus] = useState<string>('All Statuses');
  
  // Filtering logic
  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const typeMatch = reportType === 'All Types' || report.type === reportType;
      const statusMatch = status === 'All Statuses' || report.status?.toString().toLowerCase().includes(status.toLowerCase().replace(' ', ''));
      return typeMatch && statusMatch;
    });
  }, [allReports, reportType, status]);


  return (
    <div className="mt-8">
      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Report Type Filter */}
          <div>
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="relative">
              <select
                id="report-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
              >
                <option>All Types</option>
                <option value="Organic_waste_issue">Organic waste issue</option>
                <option value="Overflow">Overflow</option>
                <option value="Sanitation_problem">Sanitation problem</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
              >
                <option>All Statuses</option>
                <option value="NEW">New</option>
                <option value="Under_Review">Under Review</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Showing {filteredReports.length} reports</h3>
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} onReportSelect={onReportSelect} />
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">
          No reports match the current filters.
        </p>
      )}
    </div>
  );
};