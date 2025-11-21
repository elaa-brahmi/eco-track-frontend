export default function StatsTabs(){
    const stats=[
        { label: 'Total Bins', value: '4,250', delta: '+12' },
        { label: 'Full Bins', value: '12', delta: '+3' },
        { label: 'Active Routes', value: '8', delta: 'In Progress' },
        { label: 'Teams Online', value: '45', delta: 'All Active' },

    ];
    return(
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4 gap-4"> 
        {stats.map((s) => (
          <div
            key={s.label} className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-semibold">{s.value}</p>
                <p className="text-md font-semibold text-green-600 mt-1">{s.delta}</p>
            </div>

        ))}
            
        </div>
    )
}