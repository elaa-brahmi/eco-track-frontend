import { RouteWithTaskDto } from "@/types/RouteWithTaskDto";

export const getEmployeeRoutes = async(employeeId : string) : Promise<RouteWithTaskDto[]> => {
    const response = await fetch(`/api/proxy/api/route/${employeeId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch routes for employee');
    }
    return response.json();
};

export const getAllRoutes = async()  => {
    const response = await fetch(`/api/proxy/api/route`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch all routes');
    }
    return response.json();
};