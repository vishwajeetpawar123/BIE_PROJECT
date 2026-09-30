export type Role = 'farmer' | 'storage_owner';

export type FarmerTab = 
  | 'overview' 
  | 'decay_simulator' 
  | 'storage_finder' 
  | 'lifecycle' 
  | 'market_trends';

export type StorageOwnerTab = 
  | 'facility_overview' 
  | 'telemetry_control' 
  | 'booking_requests' 
  | 'occupancy_analytics';

export type CropId = 'onion' | 'potato' | 'wheat' | 'tomato' | 'pomegranate' | 'soybean';

export interface CropInfo {
  id: CropId;
  name: string;
  variety: string;
  idealTemp: number; // in °C
  tempRange: [number, number]; // [min, max]
  idealHumidity: number; // in %
  humidityRange: [number, number];
  standardShelfLifeDays: number;
  maxShelfLifeColdStorageDays: number;
  marketPricePerQtl: number; // in ₹
  decayFactorTemp: number; // multiplier for decay acceleration
  decayFactorHumidity: number;
  moldRiskHumidityThreshold: number;
  sproutingTempThreshold: number;
  description: string;
  iconBg: string;
}

export type BayStatus = 'occupied' | 'available' | 'maintenance' | 'warning';
export type CompressorMode = 'cooling' | 'idle' | 'dehumidifying' | 'rapid_freeze' | 'aeration';

export interface StorageBay {
  id: string;
  bayNumber: string;
  name: string;
  totalCapacityQuintals: number;
  occupiedQuintals: number;
  currentCrop?: CropId;
  storedFarmerName?: string;
  batchId?: string;
  currentTemp: number; // Current reading °C
  currentHumidity: number; // Current reading %
  targetTemp: number; // Target setting °C
  targetHumidity: number; // Target setting %
  status: BayStatus;
  compressorMode: CompressorMode;
  ozoneGeneratorActive: boolean;
  co2LevelPpm: number;
  lastTelemetryUpdate: string;
  healthIndex: number; // 0 - 100
}

export interface StorageHub {
  id: string;
  name: string;
  location: string;
  district: 'Pune' | 'Nashik' | 'Satara' | 'Ahmednagar';
  distanceKm: number;
  pricingPerQuintalDay: number; // ₹ per quintal per day
  rating: number;
  totalCapacityQuintals: number;
  availableCapacityQuintals: number;
  humidityControlled: boolean;
  darkChamberCertified: boolean;
  powerBackupHrs: number;
  activeSensorsCount: number;
  image: string;
  contactPhone: string;
}

export interface StoredBatch {
  id: string;
  cropId: CropId;
  cropName: string;
  quantityQuintals: number;
  hubId: string;
  hubName: string;
  bayId: string;
  bayNumber: string;
  entryDate: string;
  estimatedExpiryDate: string;
  currentTemp: number;
  currentHumidity: number;
  qualityIndex: number; // 0 - 100
  shelfLifeRemainingDays: number;
  status: 'optimal' | 'warning' | 'critical';
  farmerName: string;
  farmerPhone: string;
  depositValueTotal: number; // ₹
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface BookingRequest {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  cropId: CropId;
  cropName: string;
  quantityQuintals: number;
  hubId: string;
  hubName: string;
  allocatedBayId?: string;
  startDate: string;
  durationDays: number;
  totalEstimatedCost: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  rejectionReason?: string;
}

export interface TelemetryLog {
  id: string;
  bayId: string;
  timestamp: string;
  temp: number;
  humidity: number;
  co2Ppm: number;
  actionTaken: string;
  type: 'info' | 'warning' | 'override' | 'corrective';
}

export interface CultivationStage {
  id: number;
  name: string;
  durationWeeks: string;
  description: string;
  soilCondition: string;
  optimalTemperature: string;
  recommendedMoisture: string;
  pestRisk: 'Low' | 'Moderate' | 'High';
  keyChecklist: string[];
  advisoryNote: string;
  maharashtraGuidance: string;
}

export interface MandiTrend {
  mandi: string;
  district: string;
  crop: string;
  modalPricePerQtl: number;
  priceChangePercent: number;
  arrivalVolumeQtl: number;
  darkStorageProjectedPrice: number;
  recommendation: 'HOLD IN DARK STORAGE' | 'SELL NOW' | 'SPLIT STAGGERED';
  priceHistory: { day: string; price: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  linkTab?: string;
}
