"use client"

import { useState } from "react";
import { ResolveReportRequest } from "@/types/ResolveReportRequest";
import { TaskRequirement } from "@/types/TaskRequirement";  
import { resolveTask } from "@/services/tasks";

interface ResolveTaskPopupProps {
    reportId: string;
    onClose: () => void;
    onResolved: (taskId: string) => void;
}

const ResolveTaskPopup: React.FC<ResolveTaskPopupProps> = ({ reportId, onClose, onResolved }) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
    const [collectors, setCollectors] = useState(1);
    const [loaders, setLoaders] = useState(0);
    const [drivers, setDrivers] = useState(0);
    const [maintenance, setMaintenance] = useState(0);
    const [start, setStart] = useState(new Date().toISOString().slice(0, 16));
    const [end, setEnd] = useState(new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16)); // default +1h
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const request: ResolveReportRequest = {
            taskTitle,
            priority,
            requirement: {
                collectors,
                loaders,
                drivers,
                maintenances: maintenance
            },
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString()
        };

        try {
            const resp = await resolveTask(reportId, request);
            onResolved(resp.taskId);
            onClose();
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to resolve task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Resolve Report: {reportId}</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <input
                    type="text"
                    placeholder="Task Title"
                    className="border p-2 mb-2 w-full rounded"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                />

                <select
                    className="border p-2 mb-2 w-full rounded"
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                </select>

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <label>
                        Collectors:
                        <input type="number" min={0} className="border p-1 w-full rounded" value={collectors} onChange={e => setCollectors(Number(e.target.value))} />
                    </label>
                    <label>
                        Loaders:
                        <input type="number" min={0} className="border p-1 w-full rounded" value={loaders} onChange={e => setLoaders(Number(e.target.value))} />
                    </label>
                    <label>
                        Drivers:
                        <input type="number" min={0} className="border p-1 w-full rounded" value={drivers} onChange={e => setDrivers(Number(e.target.value))} />
                    </label>
                    <label>
                        Maintenance:
                        <input type="number" min={0} className="border p-1 w-full rounded" value={maintenance} onChange={e => setMaintenance(Number(e.target.value))} />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <label>
                        Start:
                        <input type="datetime-local" className="border p-2 w-full rounded" value={start} onChange={e => setStart(e.target.value)} />
                    </label>
                    <label>
                        End:
                        <input type="datetime-local" className="border p-2 w-full rounded" value={end} onChange={e => setEnd(e.target.value)} />
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>Cancel</button>
                    <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Resolving..." : "Resolve Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResolveTaskPopup;
