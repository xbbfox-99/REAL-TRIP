import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TripConfig, Day, ItineraryItem } from '../types';
import { TRIPS } from '../constants';

interface TripContextType {
  currentTripId: string;
  currentTrip: TripConfig;
  setTripId: (id: string) => void;
  allTrips: TripConfig[];
  addItineraryItem: (tripId: string, dayIndex: number, newItem: ItineraryItem) => void;
  updateItineraryItem: (tripId: string, dayIndex: number, itemIndex: number, updatedItem: ItineraryItem) => void;
  deleteItineraryItem: (tripId: string, dayIndex: number, itemIndex: number) => void;
  moveItineraryItem: (tripId: string, dayIndex: number, itemIndex: number, direction: 'up' | 'down') => void;
  resetItineraryDay: (tripId: string, dayIndex: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const LOCAL_STORAGE_CUSTOM_DAYS = 'trip_custom_days_v2';

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTripId, setCurrentTripId] = useState<string>(() => {
    return localStorage.getItem('active_trip_id') || 'jeju';
  });

  const [customDaysMap, setCustomDaysMap] = useState<Record<string, Day[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_DAYS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse custom days from localStorage:', e);
    }
    return {};
  });

  // 1. Subscribe to Firestore real-time itinerary updates for multi-device sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'itineraries'), (snapshot) => {
      const remoteDaysMap: Record<string, Day[]> = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.days && Array.isArray(data.days)) {
          remoteDaysMap[docSnap.id] = data.days;
        }
      });

      if (Object.keys(remoteDaysMap).length > 0) {
        setCustomDaysMap((prev) => ({
          ...prev,
          ...remoteDaysMap
        }));
      }
    }, (err) => {
      console.warn("Firestore itineraries snapshot error (will use local cache):", err);
    });

    return () => unsub();
  }, []);

  // 2. Save customDaysMap to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_DAYS, JSON.stringify(customDaysMap));
    } catch (e) {
      console.error('Failed to save custom days to localStorage:', e);
    }
  }, [customDaysMap]);

  // Helper to update state and sync directly to Firestore
  const updateDaysForTrip = (tripId: string, mutator: (days: Day[]) => Day[]) => {
    setCustomDaysMap((prev) => {
      const targetBaseTrip = TRIPS[tripId] || TRIPS.osaka;
      const baseDays = prev[tripId] ? prev[tripId] : targetBaseTrip.days;
      
      // Deep copy to prevent accidental mutation of previous state
      const nextDays: Day[] = JSON.parse(JSON.stringify(baseDays));
      const updatedDays = mutator(nextDays);

      // Immediately sync to Firestore
      setDoc(doc(db, 'itineraries', tripId), {
        days: updatedDays,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        console.error("Failed to sync trip days to Firestore:", err);
      });

      return {
        ...prev,
        [tripId]: updatedDays
      };
    });
  };

  const baseTrip = TRIPS[currentTripId] || TRIPS.osaka;
  
  // Computed trip with custom days if available
  const trip: TripConfig = {
    ...baseTrip,
    days: customDaysMap[currentTripId] || baseTrip.days
  };

  const setTripId = (id: string) => {
    if (TRIPS[id]) {
      setCurrentTripId(id);
      localStorage.setItem('active_trip_id', id);
    }
  };

  const addItineraryItem = (tripId: string, dayIndex: number, newItem: ItineraryItem) => {
    updateDaysForTrip(tripId, (days) => {
      if (days[dayIndex]) {
        days[dayIndex].items.push(newItem);
      }
      return days;
    });
  };

  const updateItineraryItem = (tripId: string, dayIndex: number, itemIndex: number, updatedItem: ItineraryItem) => {
    updateDaysForTrip(tripId, (days) => {
      if (days[dayIndex] && days[dayIndex].items[itemIndex]) {
        days[dayIndex].items[itemIndex] = updatedItem;
      }
      return days;
    });
  };

  const deleteItineraryItem = (tripId: string, dayIndex: number, itemIndex: number) => {
    updateDaysForTrip(tripId, (days) => {
      if (days[dayIndex]) {
        days[dayIndex].items = days[dayIndex].items.filter((_, idx) => idx !== itemIndex);
      }
      return days;
    });
  };

  const moveItineraryItem = (tripId: string, dayIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    updateDaysForTrip(tripId, (days) => {
      if (days[dayIndex]) {
        const items = days[dayIndex].items;
        const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        if (targetIndex >= 0 && targetIndex < items.length) {
          const temp = items[itemIndex];
          items[itemIndex] = items[targetIndex];
          items[targetIndex] = temp;
        }
      }
      return days;
    });
  };

  const resetItineraryDay = (tripId: string, dayIndex: number) => {
    updateDaysForTrip(tripId, (days) => {
      const targetBaseTrip = TRIPS[tripId] || TRIPS.osaka;
      if (days[dayIndex] && targetBaseTrip.days[dayIndex]) {
        days[dayIndex] = JSON.parse(JSON.stringify(targetBaseTrip.days[dayIndex]));
      }
      return days;
    });
  };

  return (
    <TripContext.Provider
      value={{
        currentTripId,
        currentTrip: trip,
        setTripId,
        allTrips: Object.values(TRIPS),
        addItineraryItem,
        updateItineraryItem,
        deleteItineraryItem,
        moveItineraryItem,
        resetItineraryDay
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
