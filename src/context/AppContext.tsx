import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  Theme,
  FarmerTab, 
  StorageOwnerTab, 
  CropId, 
  StorageBay, 
  StoredBatch, 
  BookingRequest, 
  TelemetryLog, 
  StorageHub, 
  NotificationItem,
  CompressorMode
} from '../types';
import { 
  CROPS_DATA, 
  INITIAL_STORAGE_HUBS, 
  INITIAL_STORAGE_BAYS, 
  INITIAL_FARMER_BATCHES, 
  INITIAL_BOOKING_REQUESTS, 
  INITIAL_TELEMETRY_LOGS 
} from '../data/mockData';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
  farmerTab: FarmerTab;
  setFarmerTab: (tab: FarmerTab) => void;
  storageOwnerTab: StorageOwnerTab;
  setStorageOwnerTab: (tab: StorageOwnerTab) => void;
  
  bays: StorageBay[];
  storedBatches: StoredBatch[];
  bookingRequests: BookingRequest[];
  telemetryLogs: TelemetryLog[];
  hubs: StorageHub[];
  notifications: NotificationItem[];
  
  // Simulator selection state
  selectedSimulatorCrop: CropId;
  setSelectedSimulatorCrop: (crop: CropId) => void;
  
  // Telemetry selected bay
  selectedBayId: string;
  setSelectedBayId: (bayId: string) => void;
  
  // Modals & triggers
  isBookingModalOpen: boolean;
  selectedHubForBooking: StorageHub | null;
  openBookingModal: (hub?: StorageHub) => void;
  closeBookingModal: () => void;
  
  // Business logic mutations
  createBookingRequest: (request: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveBookingRequest: (requestId: string, bayId: string) => void;
  rejectBookingRequest: (requestId: string, reason: string) => void;
  updateBayClimate: (bayId: string, targetTemp: number, targetHumidity: number) => void;
  toggleBayEmergencyMode: (bayId: string, mode: CompressorMode) => void;
  toggleOzoneGenerator: (bayId: string) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDefaults: () => void;
  
  // Computed metrics
  facilityStats: {
    totalCapacity: number;
    totalOccupied: number;
    occupancyPercent: number;
    activeBaysCount: number;
    totalBaysCount: number;
    alertCount: number;
    monthlyRevenueEstimate: number;
  };
}

const STORAGE_KEY = 'kisanseva_ai_state_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State - Defaults to Light Theme per user request
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation State
  const [role, setRole] = useState<Role>('farmer');
  const [farmerTab, setFarmerTab] = useState<FarmerTab>('overview');
  const [storageOwnerTab, setStorageOwnerTab] = useState<StorageOwnerTab>('facility_overview');

  // Core Data State
  const [bays, setBays] = useState<StorageBay[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bays`);
    return saved ? JSON.parse(saved) : INITIAL_STORAGE_BAYS;
  });

  const [storedBatches, setStoredBatches] = useState<StoredBatch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_batches`);
    return saved ? JSON.parse(saved) : INITIAL_FARMER_BATCHES;
  });

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKING_REQUESTS;
  });

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_telemetry`);
    return saved ? JSON.parse(saved) : INITIAL_TELEMETRY_LOGS;
  });

  const [hubs, setHubs] = useState<StorageHub[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hubs`);
    return saved ? JSON.parse(saved) : INITIAL_STORAGE_HUBS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Humidity Alert: Bay B-4',
      message: 'Nashik Red Onion lot in Bay B-4 reached 74.5% RH. Automated dehumidifier engaged.',
      timestamp: '2 mins ago',
      type: 'warning',
      read: false,
      linkTab: 'telemetry_control'
    },
    {
      id: 'notif-2',
      title: 'Incoming Bay Request',
      message: 'Dattatray Thorat requested 110 Quintals for Onion Cold Hold.',
      timestamp: '15 mins ago',
      type: 'info',
      read: false,
      linkTab: 'booking_requests'
    }
  ]);

  // Selected State
  const [selectedSimulatorCrop, setSelectedSimulatorCrop] = useState<CropId>('onion');
  const [selectedBayId, setSelectedBayId] = useState<string>('bay-2');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedHubForBooking, setSelectedHubForBooking] = useState<StorageHub | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bays`, JSON.stringify(bays));
  }, [bays]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(storedBatches));
  }, [storedBatches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_telemetry`, JSON.stringify(telemetryLogs));
  }, [telemetryLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hubs`, JSON.stringify(hubs));
  }, [hubs]);

  // Notification helper
  const addNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'alert',
    linkTab?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      linkTab
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Booking Modal
  const openBookingModal = (hub?: StorageHub) => {
    setSelectedHubForBooking(hub || hubs[0]);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Cross-Role Logic: Farmer submits request -> Owner sees it
  const createBookingRequest = (data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => {
    const newId = `req-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    const newRequest: BookingRequest = {
      ...data,
      id: newId,
      status: 'pending',
      createdAt: nowStr
    };

    setBookingRequests(prev => [newRequest, ...prev]);

    // Dispatches notification for Farmer and Storage Owner
    addNotification(
      'Storage Request Submitted',
      `Booking request for ${data.quantityQuintals} Quintals of ${data.cropName} submitted to ${data.hubName}. Status: Pending review.`,
      'success',
      'overview'
    );
  };

  // Cross-Role Logic: Storage Owner approves request -> Bay allocated & Farmer gets StoredBatch
  const approveBookingRequest = (requestId: string, bayId: string) => {
    const request = bookingRequests.find(r => r.id === requestId);
    const bay = bays.find(b => b.id === bayId);
    if (!request || !bay) return;

    // 1. Update Booking Request
    setBookingRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'approved', allocatedBayId: bayId } : r)
    );

    // 2. Update Storage Bay
    const cropInfo = CROPS_DATA[request.cropId] || CROPS_DATA.onion;
    const newOccupied = Math.min(bay.totalCapacityQuintals, bay.occupiedQuintals + request.quantityQuintals);
    
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          return {
            ...b,
            occupiedQuintals: newOccupied,
            currentCrop: request.cropId,
            storedFarmerName: request.farmerName,
            status: 'occupied',
            targetTemp: cropInfo.idealTemp,
            targetHumidity: cropInfo.idealHumidity,
            healthIndex: 98,
            lastTelemetryUpdate: 'Just now'
          };
        }
        return b;
      })
    );

    // 3. Create active batch for Farmer
    const newBatchId = `batch-${Date.now().toString().slice(-4)}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (request.durationDays || 60));

    const newBatch: StoredBatch = {
      id: newBatchId,
      cropId: request.cropId,
      cropName: `${request.cropName} (${request.farmerName})`,
      quantityQuintals: request.quantityQuintals,
      hubId: request.hubId,
      hubName: request.hubName,
      bayId: bay.id,
      bayNumber: bay.bayNumber,
      entryDate: new Date().toISOString().slice(0, 10),
      estimatedExpiryDate: expiryDate.toISOString().slice(0, 10),
      currentTemp: cropInfo.idealTemp,
      currentHumidity: cropInfo.idealHumidity,
      qualityIndex: 98,
      shelfLifeRemainingDays: request.durationDays,
      status: 'optimal',
      farmerName: request.farmerName,
      farmerPhone: request.farmerPhone,
      depositValueTotal: request.quantityQuintals * cropInfo.marketPricePerQtl
    };

    setStoredBatches(prev => [newBatch, ...prev]);

    // 4. Update Hub available capacity
    setHubs(prev =>
      prev.map(h => {
        if (h.id === request.hubId) {
          return {
            ...h,
            availableCapacityQuintals: Math.max(0, h.availableCapacityQuintals - request.quantityQuintals)
          };
        }
        return h;
      })
    );

    // 5. Add Telemetry Log
    const newLog: TelemetryLog = {
      id: `tl-${Date.now()}`,
      bayId: bay.id,
      timestamp: new Date().toLocaleTimeString(),
      temp: cropInfo.idealTemp,
      humidity: cropInfo.idealHumidity,
      co2Ppm: 490,
      actionTaken: `Bay ${bay.bayNumber} allocated to ${request.farmerName} for ${request.cropName} (${request.quantityQuintals} qtl). Auto-climate lock engaged.`,
      type: 'info'
    };
    setTelemetryLogs(prev => [newLog, ...prev]);

    addNotification(
      'Bay Allocation Confirmed',
      `Booking #${requestId} approved! Allocated to ${bay.bayNumber}. Telemetry active.`,
      'success',
      'facility_overview'
    );
  };

  const rejectBookingRequest = (requestId: string, reason: string) => {
    setBookingRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r)
    );

    addNotification(
      'Booking Request Declined',
      `Request #${requestId} rejected: "${reason}".`,
      'warning',
      'booking_requests'
    );
  };

  // Live Telemetry Override
  const updateBayClimate = (bayId: string, targetTemp: number, targetHumidity: number) => {
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          // Determine realistic compressor response
          let compressor: CompressorMode = 'idle';
          if (targetTemp < b.currentTemp) compressor = 'cooling';
          else if (targetHumidity < b.currentHumidity) compressor = 'dehumidifying';

          return {
            ...b,
            targetTemp,
            targetHumidity,
            compressorMode: compressor,
            lastTelemetryUpdate: 'Just now'
          };
        }
        return b;
      })
    );

    const bay = bays.find(b => b.id === bayId);
    const newLog: TelemetryLog = {
      id: `tl-${Date.now()}`,
      bayId,
      timestamp: new Date().toLocaleTimeString(),
      temp: targetTemp,
      humidity: targetHumidity,
      co2Ppm: 510,
      actionTaken: `Manual climate override on ${bay?.bayNumber || bayId}: Target set to ${targetTemp}°C / ${targetHumidity}% RH. HVAC modulating.`,
      type: 'override'
    };
    setTelemetryLogs(prev => [newLog, ...prev]);

    addNotification(
      'Climate Override Applied',
      `${bay?.bayNumber || bayId} target updated to ${targetTemp}°C / ${targetHumidity}% RH.`,
      'info',
      'telemetry_control'
    );
  };

  const toggleBayEmergencyMode = (bayId: string, mode: CompressorMode) => {
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          const newMode = b.compressorMode === mode ? 'cooling' : mode;
          return {
            ...b,
            compressorMode: newMode,
            lastTelemetryUpdate: 'Just now'
          };
        }
        return b;
      })
    );

    const bay = bays.find(b => b.id === bayId);
    const newLog: TelemetryLog = {
      id: `tl-${Date.now()}`,
      bayId,
      timestamp: new Date().toLocaleTimeString(),
      temp: bay?.currentTemp || 15,
      humidity: bay?.currentHumidity || 65,
      co2Ppm: 460,
      actionTaken: `Special mode [${mode.toUpperCase()}] triggered on ${bay?.bayNumber}. System operating at override power.`,
      type: 'corrective'
    };
    setTelemetryLogs(prev => [newLog, ...prev]);
  };

  const toggleOzoneGenerator = (bayId: string) => {
    setBays(prev =>
      prev.map(b => {
        if (b.id === bayId) {
          return {
            ...b,
            ozoneGeneratorActive: !b.ozoneGeneratorActive,
            lastTelemetryUpdate: 'Just now'
          };
        }
        return b;
      })
    );
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_bays`);
    localStorage.removeItem(`${STORAGE_KEY}_batches`);
    localStorage.removeItem(`${STORAGE_KEY}_requests`);
    localStorage.removeItem(`${STORAGE_KEY}_telemetry`);
    localStorage.removeItem(`${STORAGE_KEY}_hubs`);
    
    setBays(INITIAL_STORAGE_BAYS);
    setStoredBatches(INITIAL_FARMER_BATCHES);
    setBookingRequests(INITIAL_BOOKING_REQUESTS);
    setTelemetryLogs(INITIAL_TELEMETRY_LOGS);
    setHubs(INITIAL_STORAGE_HUBS);
    setSelectedSimulatorCrop('onion');
    setSelectedBayId('bay-2');
    
    addNotification('Platform Reset', 'Demo data restored to pristine state.', 'info');
  };

  // Facility Stats for Storage Owner
  const totalCapacity = bays.reduce((sum, b) => sum + b.totalCapacityQuintals, 0);
  const totalOccupied = bays.reduce((sum, b) => sum + b.occupiedQuintals, 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const activeBaysCount = bays.filter(b => b.status === 'occupied').length;
  const alertCount = bays.filter(b => b.status === 'warning').length;
  const monthlyRevenueEstimate = Math.round(totalOccupied * 3.6 * 30); // Avg ₹3.6/qtl/day

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        role,
        setRole,
        farmerTab,
        setFarmerTab,
        storageOwnerTab,
        setStorageOwnerTab,
        bays,
        storedBatches,
        bookingRequests,
        telemetryLogs,
        hubs,
        notifications,
        selectedSimulatorCrop,
        setSelectedSimulatorCrop,
        selectedBayId,
        setSelectedBayId,
        isBookingModalOpen,
        selectedHubForBooking,
        openBookingModal,
        closeBookingModal,
        createBookingRequest,
        approveBookingRequest,
        rejectBookingRequest,
        updateBayClimate,
        toggleBayEmergencyMode,
        toggleOzoneGenerator,
        dismissNotification,
        clearAllNotifications,
        resetToDefaults,
        facilityStats: {
          totalCapacity,
          totalOccupied,
          occupancyPercent,
          activeBaysCount,
          totalBaysCount: bays.length,
          alertCount,
          monthlyRevenueEstimate
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
