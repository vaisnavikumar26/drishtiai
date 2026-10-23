exports.runSimulinkModel = (req, res) => {
  const {
    patientsPerDay = 150,
    healthWorkers = 4,
    doctors = 2,
    imagesPerPatient = 2,
    aiLatencySec = 1.8,
    doctorReviewMin = 3.5,
    offlineRatePct = 30
  } = req.body;

  const minutesPerDay = 8 * 60;
  const minutesPerPatientAcquisition = 4.0;
  const dailyAcquisitionCapacity = Math.floor((healthWorkers * minutesPerDay) / minutesPerPatientAcquisition);

  const imagesPerDay = patientsPerDay * imagesPerPatient;
  const aiDailySecondsNeeded = imagesPerDay * aiLatencySec;
  const aiThroughputPerHour = Math.floor(3600 / aiLatencySec);
  const doctorCapacityDaily = Math.floor((doctors * minutesPerDay) / doctorReviewMin);
  const estimatedReferrals = Math.round(patientsPerDay * 0.28);
  const doctorUtilizationPct = Math.min(100, Math.round((estimatedReferrals / Math.max(1, doctorCapacityDaily)) * 100));

  let bottleneck = 'None (Optimal Operational Flow)';
  if (patientsPerDay > dailyAcquisitionCapacity) {
    bottleneck = 'Patient Acquisition & Fundus Capture (Add more ASHA workers)';
  } else if (estimatedReferrals > doctorCapacityDaily) {
    bottleneck = 'Ophthalmologist Review Queue (Add tele-ophthalmology slots)';
  }

  const annualScreeningCapacity = Math.floor(Math.min(dailyAcquisitionCapacity, patientsPerDay) * 280);

  res.json({
    model: 'DrishtiAI District Screening Capacity Simulator (Simulink-Inspired Mathematical Model)',
    inputs: { patientsPerDay, healthWorkers, doctors, imagesPerPatient, aiLatencySec, doctorReviewMin, offlineRatePct },
    metrics: {
      dailyAcquisitionCapacity,
      doctorDailyCapacity: doctorCapacityDaily,
      estimatedReferrals,
      doctorUtilizationPct,
      aiThroughputPerHour,
      bottleneck,
      annualScreeningCapacity,
      averageTurnaroundMinutes: Math.round(minutesPerPatientAcquisition + (aiLatencySec / 60) + (doctorReviewMin * 0.28))
    }
  });
};