"use client"
import { FilterBarAndReports } from "@/components/admin/FilterBarAndReports"
import { ReportTabs } from "@/components/admin/ReportTabs"
import Sidebar from "@/components/admin/sidebar"
import { fetchReports } from "@/services/report"
import { ReportData } from "@/types/reportType"
import { calculateSummary } from "@/utils/calculSumary"
import RequireRole from "@/utils/RequireRole"
import { useEffect, useState } from "react"

const ReportsPage =  () => {
  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReports();
        console.log("Fetched reports:", data);
        setReports(data as ReportData[]); 
        } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);
  let summary = null;
  if(reports.length===0 ){
    return(
      <RequireRole roles={["admin-role"]}>
        <div className="flex mt-16">
          <Sidebar />
          <main className="flex-1 md:bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Reports Dashboard</h1>
            <p className="text-gray-600">No reports available at the moment.</p>
          </main>
        </div>
    </RequireRole>
    )

  }
else{
   summary = calculateSummary(reports);
}


    return (
<RequireRole roles={["admin-role"]}>
  <div className="flex mt-16">
    <Sidebar />
    <main className="flex-1 p-10 md:bg-gray-100 min-h-screen"> 
      <h1 className="text-2xl font-bold mb-6 ">Reports Dashboard</h1>
              
      {loading ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='mt-3'>Loading reports...</p>
        </div>
        ) : (
                <>
                  <ReportTabs summary={summary}  />
                  
                  <FilterBarAndReports 
                    allReports={reports} 
                    onReportSelect={setSelectedReport}
                  />
                </>
              )}

              {/* Placeholder for Report Details Modal */}
              {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-2xl">
                      <h2 className="text-xl font-bold mb-4">Report Details: {selectedReport.id}</h2>
                      <p className="text-gray-700 mb-4">{selectedReport.description}</p>
                      <p className="text-sm text-gray-500">Location: {selectedReport.location}</p>
                      <p className="text-sm text-gray-500">Status: {selectedReport.status}</p>
                      <button 
                        onClick={() => setSelectedReport(null)} 
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Close
                      </button>
                    </div>
                </div>
              )}
    </main>
  </div>
</RequireRole>
    )
}
export default ReportsPage