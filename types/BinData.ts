export interface BinData {
  id?:string
  fillLevel?: number;
  lastUpdated?: string;
  lastEmptied?: string;
  location: [number, number];
  type: BinType;
  status: BinStatus;
}
export type BinType = 'plastic' | 'organic' | 'glass' | 'paper';
export type BinStatus = 'normal' | 'broken' | 'under_maintenance';
