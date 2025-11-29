import { ResolveReportRequest } from "@/types/ResolveReportRequest";

export const resolveTask = async(reportId : string,request:ResolveReportRequest)  => {
    const response = await fetch(`/api/proxy/api/tasks/${reportId}/resolve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error('Failed to resolve task');
    }
    return response.json();
};
export const completeTask = async(taskId : string)  => {
    const response = await fetch(`/api/proxy/api/tasks/tasks/${taskId}/complete`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to complete task');
    }
    return response.json();
};
export const getTasksByEmployeeId = async(employeeId : string)  => {
    const response = await fetch(`/api/proxy/api/tasks/employees/${employeeId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const getAllTasks = async()  => {
    const response = await fetch(`/api/proxy/api/tasks`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch all tasks');
    }
    return response.json();
};