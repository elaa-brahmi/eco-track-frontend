import { ResolveReportRequest } from "@/types/ResolveReportRequest";
import { Task } from "@/types/task";

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
    
    // Handle both JSON and text responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return response.json();
    } else {
        const text = await response.text();
        return { message: text, success: true };
    }
};
export const getTasksByEmployeeId = async(employeeId : string) : Promise<Task[]>  => {
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