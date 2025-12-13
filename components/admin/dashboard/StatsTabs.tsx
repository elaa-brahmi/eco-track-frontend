'use client';

import { fetchBins } from '@/services/containers';
import { getEmployees } from '@/services/employees';
import { getAllTasks } from '@/services/tasks';
import { getAllVehicles } from '@/services/vehicles';
import { BinData } from '@/types/BinData';
import { EmployeeData } from '@/types/EmployeeData';
import { Task } from '@/types/task';
import { Vehicle } from '@/types/vehicle';
import { useEffect, useState } from 'react';

export default function StatsTabs() {

    const [bins, setBins] = useState<BinData[]>([]);
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [tasks, setTasks] = useState< Task[]>([]);
    const [fullBins, setFullBins] = useState<number>(0);


    useEffect(() => {
        const load = async () => {
            const fetchedBins = await fetchBins();
            console.log('Fetched Bins:', fetchedBins);
            setBins(fetchedBins);
            if(fetchedBins&&fetchedBins.length>0){
                const full = fetchedBins.filter(bin=>bin?.fillLevel>=75).length;
                setFullBins(full);
            }
            const fetchedEmployees = await getEmployees();
            setEmployees(fetchedEmployees);
            const data = await getAllVehicles();
            setVehicles(data);
            const tasks = await getAllTasks();
            for (const task of tasks) {
                if(task.status==="Pending"){
                    setTasks(prev=>[...prev,task]);
                }
            }
        };

        load();
    }, []);
    const stats = [
        { label: 'Total Bins', value: bins.length,  },
        { label: 'Full Bins', value: fullBins,  },
        { label: 'Active Routes', value: tasks.length, delta: 'In Progress' },
        { label: 'Employees ', value: employees.length, delta: 'All Active' },

    ];
    return (
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