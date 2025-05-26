export enum UsageType {
  WATER = 'Water',
  ENERGY = 'Energy',
  GAS = 'Gas'
}

export interface UsageRecord {
  id: string;
  houseId: string; // Foreign key to House
  type: UsageType;
  usage: number; // e.g., kWh for energy, m³ for water
  month: number; // 1-12
  year: number;
  recordedAt: Date;
}
