import { ReportData, ReportStatus, ReportTypee } from "@/types/reportType";
import { AlertCircle, Clock, MapPin } from "lucide-react";

interface ReportCardProps {
  report: ReportData;
  onReportSelect: (report: ReportData) => void;
}

const getReportTypeStyle = (type: ReportTypee) => {
  switch (type) {
    case 'Overflow':
      return { text: 'Overflow', bgColor: 'bg-red-500', icon: <AlertCircle size={14} className="mr-1" /> };
    case 'Organic_waste_issue':
      return { text: 'Organic waste issue', bgColor: 'bg-yellow-500', icon: <Clock size={14} className="mr-1" /> };
    case 'Sanitation_problem':
      return { text: 'Sanitation problem', bgColor: 'bg-orange-500', icon: <AlertCircle size={14} className="mr-1" /> };
    default:
      return { text: 'Issue', bgColor: 'bg-gray-500', icon: null };
  }
};

const getReportStatusStyle = (status: ReportStatus) => {
  switch (status) {
    case 'NEW':
      return { text: 'New', bgColor: 'bg-red-500', textColor: 'text-white' };
    case 'Under_Review':
      return { text: 'Under review', bgColor: 'bg-yellow-500', textColor: 'text-white' };
    case 'RESOLVED':
      return { text: 'Resolved', bgColor: 'bg-green-500', textColor: 'text-white' };
    default:
      return { text: 'N/A', bgColor: 'bg-gray-500', textColor: 'text-white' };
  }
};


export const ReportCard: React.FC<ReportCardProps> = ({ report, onReportSelect }) => {
  const typeStyle = getReportTypeStyle(report.type as ReportTypee);
  const statusStyle = getReportStatusStyle(report.status as ReportStatus);

  return (
    <div className="bg-white rounded-lg shadow-md  hover:shadow-lg transition duration-300 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 relative min-h-[120px] bg-gray-50">
        <img
          src={report.photoUrl as string}
          alt="Report Image"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>


      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className={`inline-flex items-center text-xs  px-2.5 py-1 rounded-2xl ${typeStyle.bgColor} text-white`}>
              {typeStyle.icon}
              <span className="ml-2">{typeStyle.text}</span>
            </div>
            <div className={`inline-flex items-center text-xs  px-2.5 py-1 rounded-2xl ${statusStyle.bgColor} ${statusStyle.textColor}`}>
              {statusStyle.text}
            </div>
          </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {report.description}
            </p>

            <div className="flex items-center text-xs text-gray-500 mb-2">
                <MapPin size={14} className="mr-1 flex-shrink-0 text-blue-500" />
                <span>{report.location}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
                <span className="font-bold mr-1">Bin ID:</span>
                <span>{report.id}</span>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Reported on {report.createdAt}</p>
            <button 
              onClick={() => onReportSelect(report)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition duration-150"
            >
                View Full Details
            </button>
        </div>
      </div>
    </div>
  );
};