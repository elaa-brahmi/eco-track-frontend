export interface Vehicle {
  id?: string;       
  name: string;
  available?: boolean; 
  location: number[];
  capacity: number;
  schedule?: any[];  
}
