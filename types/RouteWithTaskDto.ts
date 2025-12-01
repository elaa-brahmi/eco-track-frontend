export type RouteWithTaskDto = {
  routeId: string;
  taskId: string;
  vehicleId: string;
  containerOrder: string[];
  polyline: string;
  totalDistanceKm: number;
  totalDurationMin: number;
  calculatedAt: string;
};