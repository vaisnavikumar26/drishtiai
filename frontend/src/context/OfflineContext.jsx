import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUnsyncedScreenings, markAsSynced } from '../services/db.js';
import { syncOfflineRecordsToBackend } from '../services/api.js';

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncMessage, setLastSyncMessage] = useState(null);

  const refreshPendingCount = async () => {
    try {
      const records = await getUnsyncedScreenings();
      setPendingCount(records.length);
    } catch (err) {
      console.warn('Dexie pending count error:', err);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 6000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const triggerAutoSync = async () => {
    if (!navigator.onLine) return;
    try {
      const records = await getUnsyncedScreenings();
      if (records.length === 0) return;

      setIsSyncing(true);
      const res = await syncOfflineRecordsToBackend(records);
      
      for (const rec of records) {
        if (rec.id) await markAsSynced(rec.id);
      }

      setLastSyncMessage(`Successfully synchronized ${records.length} offline records to central database!`);
      await refreshPendingCount();
    } catch (err) {
      console.error('Auto-sync failed:', err);
      setLastSyncMessage('Sync failed. Will retry automatically when connection stabilizes.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      pendingCount,
      isSyncing,
      lastSyncMessage,
      triggerAutoSync,
      refreshPendingCount
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}