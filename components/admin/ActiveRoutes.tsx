import { Truck } from "lucide-react";

export default function ActiveRoutes() {
const routes = [
{
zone: 'Downtown',
team: 'Team Alpha',
bins: 8,
status: 'In Progress',
time: '3 hours',
},
{
zone: 'Industrial',
team: 'Team Beta',
bins: 5,
status: 'Scheduled',
time: 'Today 2PM',
},
{
zone: 'Commercial',
team: 'Team Gamma',
bins: 6,
status: 'Scheduled',
time: 'Tomorrow 8AM',
},
];


return (
<div className="bg-white shadow rounded-xl p-4 h-fit">
<h2 className="font-bold mb-4 flex items-center gap-2">
    <Truck/> Active Routes</h2>
<div className="space-y-4">
{routes.map((r) => (
<div key={r.zone} className="border-b border-gray-200 hover:bg-gray-50 pb-3 last:border-none">
<p className="font-medium">{r.zone}</p>
<p className="text-sm text-gray-500">Team: {r.team}</p>
<p className="text-sm text-gray-700">{r.bins} bins</p>
<div className="text-sm font-semibold text-blue-600">{r.status} – {r.time}</div>
</div>
))}
</div>
</div>
);
}