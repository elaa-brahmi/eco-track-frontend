import Sidebar from '@/components/admin/sidebar';
import StatsTabs from '@/components/admin/StatsTabs';
import InteractiveMap from '@/components/admin/InteractiveMap';
import ActiveRoutes from '@/components/admin/ActiveRoutes';
import BinsTable from '@/components/admin/BinsTable';
import RequireRole from '@/utils/RequireRole';


export default function AdminDashboard() {
return (
<RequireRole roles={["admin-role"]}>
<div className="flex mt-16">
    <Sidebar />
    <main className="flex-1 p-6 md:bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold">Monitor</h1>
        <p className="text-gray-500 text-sm">Real-time bin tracking and management</p>
        <StatsTabs />
        <div className="flex flex-col lg:flex-row lg:justify-between lg:**:items-center">
            <div className="col-span-2 lg:flex-2 p-4">
                <InteractiveMap />
            </div>
            <div className="lg:flex-1 p-4">
                <ActiveRoutes />
            </div>
        </div>
    </main>
</div>
</RequireRole>
);
}