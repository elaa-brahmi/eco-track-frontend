export default function BinsTable() {
const bins = [
{ id: 'BIN-001', location: 'Main Street & 5th Ave', fill: 85, type: 'Plastic', status: 'Normal', updated: '2 min ago' },
{ id: 'BIN-002', location: 'Central Park North', fill: 92, type: 'Organic', status: 'Full', updated: '1 min ago' },
];


return (
<div className="mt-6 bg-white shadow rounded-xl p-4">
    <h2 className="font-bold mb-4">Bin Status</h2>
    <table className="w-full text-left text-sm ">
        <thead>
            <tr className="border-b text-gray-500">
                <th className="py-2">Bin ID</th>
                <th>Location</th>
                <th>Fill Level</th>
                <th>Type</th>
                <th>Status</th>
                <th>Updated</th>
            </tr>
        </thead>
        <tbody>
        {bins.map((b) => (
        <tr key={b.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-2 text-green-600 font-medium">{b.id}</td>
            <td>{b.location}</td>
            <td>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-20 bg-red-500 rounded-full"></div>
                    {b.fill}%
                </div>
            </td>
            <td>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs">{b.type}</span>
            </td>
            <td>
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-xs">{b.status}</span>
            </td>
            <td>{b.updated}</td>
        </tr>
        ))}
        </tbody>
    </table>
</div>
);
}