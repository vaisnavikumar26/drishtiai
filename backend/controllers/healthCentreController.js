const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const { auditLog } = require('../middleware/auth');

// Haversine formula to compute great-circle distance between two coordinates in kilometers
function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// 1. Get All Health Centres with Distance and Search Filtering
exports.getAllCentres = (req, res) => {
  const { query, district, userLat, userLng } = req.query;
  let centres = [...store.data.healthCentres];

  // Filter by District
  if (district && district !== 'All') {
    centres = centres.filter(c => c.district.toLowerCase() === district.toLowerCase());
  }

  // Filter by query (Village, Town, District, PIN code, or Name)
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    centres = centres.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      (c.villageOrTown && c.villageOrTown.toLowerCase().includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q)) ||
      (c.pincode && c.pincode.includes(q))
    );
  }

  // Calculate distance if browser geolocation was provided by user
  if (userLat && userLng) {
    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);
    if (!isNaN(uLat) && !isNaN(uLng)) {
      centres = centres.map(c => {
        const distanceKm = calculateHaversineDistanceKm(uLat, uLng, c.lat, c.lng);
        return { ...c, distanceKm };
      });
      centres.sort((a, b) => a.distanceKm - b.distanceKm);
    }
  }

  return res.json({
    total: centres.length,
    centres
  });
};

// 2. Get Single Health Centre by ID
exports.getCentreById = (req, res) => {
  const item = store.data.healthCentres.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Health Centre not found' });
  return res.json(item);
};

// 3. Admin: Create Verified Health Centre
exports.createCentre = (req, res) => {
  const b = req.body;
  if (!b.name || !b.address || !b.district) {
    return res.status(400).json({ error: 'Name, address, and district are required.' });
  }

  const id = 'centre-' + uuidv4().slice(0, 8);
  const newCentre = {
    id,
    name: b.name.trim(),
    category: b.category || 'Primary Health Centre (PHC)',
    address: b.address.trim(),
    district: b.district.trim(),
    villageOrTown: b.villageOrTown ? b.villageOrTown.trim() : '',
    pincode: b.pincode ? b.pincode.trim() : '',
    phone: b.phone ? b.phone.trim() : '+91 108',
    emergencyPhone: b.emergencyPhone || '108',
    services: Array.isArray(b.services) ? b.services : (b.services ? b.services.split(',').map(s => s.trim()) : ['Diabetic Retinopathy Screening']),
    openingHours: b.openingHours || 'Monday to Saturday: 8:00 AM – 4:00 PM',
    directionsUrl: b.directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name)}`,
    emergencyInstructions: b.emergencyInstructions || 'Casualty services available 24x7 for emergencies.',
    lat: parseFloat(b.lat) || 8.7062,
    lng: parseFloat(b.lng) || 77.4560,
    isVerified: true
  };

  store.data.healthCentres.push(newCentre);
  store.save();
  auditLog(req, 'HEALTH_CENTRE_CREATED', `Admin added verified health centre: ${newCentre.name}`);

  return res.status(201).json({ message: 'Health Centre created successfully', centre: newCentre });
};

// 4. Admin: Update Health Centre
exports.updateCentre = (req, res) => {
  const centre = store.data.healthCentres.find(c => c.id === req.params.id);
  if (!centre) return res.status(404).json({ error: 'Health Centre not found' });

  const b = req.body;
  if (b.name) centre.name = b.name.trim();
  if (b.category) centre.category = b.category;
  if (b.address) centre.address = b.address.trim();
  if (b.district) centre.district = b.district.trim();
  if (b.villageOrTown) centre.villageOrTown = b.villageOrTown.trim();
  if (b.pincode) centre.pincode = b.pincode.trim();
  if (b.phone) centre.phone = b.phone.trim();
  if (b.emergencyPhone) centre.emergencyPhone = b.emergencyPhone.trim();
  if (b.services) centre.services = Array.isArray(b.services) ? b.services : b.services.split(',').map(s => s.trim());
  if (b.openingHours) centre.openingHours = b.openingHours.trim();
  if (b.directionsUrl) centre.directionsUrl = b.directionsUrl.trim();
  if (b.emergencyInstructions) centre.emergencyInstructions = b.emergencyInstructions.trim();
  if (b.lat !== undefined) centre.lat = parseFloat(b.lat);
  if (b.lng !== undefined) centre.lng = parseFloat(b.lng);
  if (b.isVerified !== undefined) centre.isVerified = Boolean(b.isVerified);

  store.save();
  auditLog(req, 'HEALTH_CENTRE_UPDATED', `Admin updated health centre: ${centre.name}`);

  return res.json({ message: 'Health Centre updated successfully', centre });
};

// 5. Admin: Delete Health Centre
exports.deleteCentre = (req, res) => {
  const idx = store.data.healthCentres.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Health Centre not found' });

  const removed = store.data.healthCentres.splice(idx, 1)[0];
  store.save();
  auditLog(req, 'HEALTH_CENTRE_DELETED', `Admin deleted health centre: ${removed.name}`);

  return res.json({ message: 'Health Centre removed successfully' });
};
