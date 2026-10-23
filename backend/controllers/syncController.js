const store = require('../config/db');

exports.syncOfflineRecords = (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records) || records.length === 0) {
    return res.json({ message: 'No records to sync', syncedCount: 0 });
  }

  let count = 0;
  records.forEach(r => {
    const ex = store.data.screenings.find(s => s.screeningId === r.screeningId);
    if (!ex) {
      store.data.screenings.unshift({
        ...r,
        syncedAt: new Date().toISOString(),
        source: 'Offline Camp (Auto-Synced)'
      });
      count++;
    }
  });

  store.save();
  res.json({
    message: 'Offline records synchronized successfully',
    syncedCount: count,
    totalRecords: store.data.screenings.length
  });
};