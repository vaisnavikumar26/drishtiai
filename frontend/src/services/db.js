import Dexie from 'dexie';

export const db = new Dexie('DrishtiAIDatabase');

db.version(1).stores({
  offlineScreenings: '++id, screeningId, patientName, mobile, screeningDate, qualityScore, predictionLevel, synced',
  cachedPatients: '++id, patientId, name, mobile, village',
  cachedClinics: '++id, clinicId, name, district'
});

export async function saveOfflineScreening(record) {
  try {
    const id = await db.offlineScreenings.add({
      ...record,
      synced: 0,
      createdAt: new Date().toISOString()
    });
    return id;
  } catch (err) {
    console.error('[IndexedDB] Save error:', err);
    throw err;
  }
}

export async function getUnsyncedScreenings() {
  return await db.offlineScreenings.where('synced').equals(0).toArray();
}

export async function markAsSynced(id) {
  return await db.offlineScreenings.update(id, { synced: 1 });
}