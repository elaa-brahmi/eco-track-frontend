import Sidebar from '@/src/components/admin/sidebar';
import StatsTabs from '@/src/components/admin/StatsTabs';
import InteractiveMap from '@/src/components/admin/InteractiveMap';
import ActiveRoutes from '@/src/components/admin/ActiveRoutes';
import BinsTable from '@/src/components/admin/BinsTable';


export default function MonitorPage() {
return (
<div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold">Monitor</h1>
        <p className="text-gray-500 text-sm">Real-time bin tracking and management</p>
        <StatsTabs />
        <div className="flex flex-col lg:flex-row lg:justify-between lg:**:items-center">
            <div className="col-span-2 lg:flex-2 p-4">
                <InteractiveMap />
                <BinsTable />
            </div>
            <div className="lg:flex-1 p-4">
                <ActiveRoutes />
            </div>
        </div>
    </main>
</div>
);
}