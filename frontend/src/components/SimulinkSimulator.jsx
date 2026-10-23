import React, { useState, useEffect } from 'react';
import { Cpu, Users, Stethoscope, Clock, Zap, ArrowRight, BarChart3 } from 'lucide-react';
import { runSimulinkCapacityModel } from '../services/api.js';

export default function SimulinkSimulator() {
  const [params, setParams] = useState({
    patientsPerDay: 180,
    healthWorkers: 4,
    doctors: 2,
    imagesPerPatient: 2,
    aiLatencySec: 1.8,
    doctorReviewMin: 3.5,
    offlineRatePct: 30
  });

  const [simResults, setSimResults] = useState(null);

  const calculateSimulation = async () => {
    const data = await runSimulinkCapacityModel(params);
    setSimResults(data.metrics);
  };

  useEffect(() => {
    calculateSimulation();
  }, [params]);

  return (
    <div className="bg-slate-900/90 border border-sky-900/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[10px] tracking-widest uppercase border border-cyan-500/30">
              Discrete-Event Simulation
            </span>
            <span className="text-xs text-slate-400">Simulink-Inspired Deployment Model</span>
          </div>
          <h2 className="text-lg font-black text-white mt-1">
            District-Level Rural Screening Capacity Simulator
          </h2>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          State: <strong className="text-white">Tamil Nadu District Health Network</strong>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Slider 1 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">Target Patients / Day:</span>
            <span className="text-sky-400 font-bold text-sm">{params.patientsPerDay}</span>
          </div>
          <input
            type="range"
            min="30"
            max="600"
            step="10"
            value={params.patientsPerDay}
            onChange={(e) => setParams({ ...params, patientsPerDay: Number(e.target.value) })}
            className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 2 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">Active ASHA Health Workers:</span>
            <span className="text-emerald-400 font-bold text-sm">{params.healthWorkers}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={params.healthWorkers}
            onChange={(e) => setParams({ ...params, healthWorkers: Number(e.target.value) })}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 3 */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-semibold">Tele-Ophthalmologists:</span>
            <span className="text-cyan-400 font-bold text-sm">{params.doctors}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={params.doctors}
            onChange={(e) => setParams({ ...params, doctors: Number(e.target.value) })}
            className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

      </div>

      {/* Operational Stage Flow Diagram */}
      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 mb-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          End-to-End Operational Pipeline Stage Simulation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center">
          
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">1. Patient Camp</p>
            <p className="text-[10px] text-slate-400">{params.patientsPerDay} arrivals/day</p>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 mx-auto hidden sm:block" />

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Zap className="w-5 h-5 text-sky-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">2. AI Screening</p>
            <p className="text-[10px] text-slate-400">1.8s / patient</p>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 mx-auto hidden sm:block" />

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Stethoscope className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">3. Doctor Review</p>
            <p className="text-[10px] text-slate-400">~{simResults?.estimatedReferrals || 50} referable cases</p>
          </div>

        </div>
      </div>

      {/* Output Metrics KPI Grid */}
      {simResults && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Daily Screening Max</span>
            <span className="text-2xl font-black text-emerald-400">{simResults.dailyAcquisitionCapacity}</span>
            <span className="text-[10px] text-slate-500 block">patients / day</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Doctor Telemed Capacity</span>
            <span className="text-2xl font-black text-cyan-400">{simResults.doctorDailyCapacity}</span>
            <span className="text-[10px] text-slate-500 block">reviews / day</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Annual District Impact</span>
            <span className="text-2xl font-black text-sky-400">{simResults.annualScreeningCapacity?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block">patients / year</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">System Bottleneck</span>
            <span className="text-xs font-bold text-amber-300 leading-tight block mt-1">{simResults.bottleneck}</span>
          </div>
        </div>
      )}
    </div>
  );
}