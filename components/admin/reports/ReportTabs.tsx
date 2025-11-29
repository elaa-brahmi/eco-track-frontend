import { ReportSummary } from "@/types/reportType";

interface ReportTabsProps {
  summary: ReportSummary;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ summary }) => {
  const tabs = [
    { title: 'Total Reports', value: summary.total, color: 'text-gray-900', borderColor: 'border-gray-700' },
    { title: 'New Reports', value: summary.new, color: 'text-red-600', borderColor: 'border-red-500' },
    { title: 'Under Review', value: summary.underReview, color: 'text-yellow-600', borderColor: 'border-yellow-500' },
    { title: 'Resolved', value: summary.resolved, color: 'text-green-600', borderColor: 'border-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {tabs.map((tab) => (
        <div
          key={tab.title}
          className={`bg-white p-6 rounded-lg shadow-sm border-t-4 ${tab.borderColor} transition duration-300 hover:shadow-md`}
        >
          <p className="text-sm text-gray-500 font-medium mb-1">{tab.title}</p>
          <p className={`text-3xl font-bold ${tab.color}`}>
            {tab.value}
          </p>
        </div>
      ))}
    </div>
  );
};