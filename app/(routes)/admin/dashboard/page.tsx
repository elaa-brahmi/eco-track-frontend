import Sidebar from '@/components/admin/dashboard/sidebar';
import StatsTabs from '@/components/admin/dashboard/StatsTabs';
import InteractiveMap from '@/components/admin/dashboard/InteractiveMap';
import ActiveRoutes from '@/components/admin/dashboard/ActiveRoutes';
import RequireRole from '@/utils/RequireRole';
import BinsMap from '@/components/admin/maps/BinsMap';


export default function AdminDashboard() {
return (
<RequireRole roles={["admin-role"]}>
<div className="flex mt-16">
  <Sidebar />
  <main className="flex-1 p-6 md:bg-gray-100 min-h-screen w-full overflow-hidden">
    <h1 className="text-2xl font-bold">Monitor</h1>
    <StatsTabs />

    <div className="flex flex-col mt-16">
      <BinsMap />
    </div>
  </main>
</div>

</RequireRole>
);
}