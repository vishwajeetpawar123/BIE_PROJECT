import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA } from '../data/mockData';
import { CropId } from '../types';
import { X, Calendar, Package, MapPin, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequestBayModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    selectedHubForBooking, 
    createBookingRequest,
    hubs 
  } = useApp();

  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [farmerPhone, setFarmerPhone] = useState('+91 98221 10923');
  const [farmerLocation, setFarmerLocation] = useState('Shirur / Chakan Agri Belt, Pune');
  const [selectedCrop, setSelectedCrop] = useState<CropId>('onion');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(100);
  const [durationDays, setDurationDays] = useState<number>(60);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isBookingModalOpen) return null;

  const currentHub = selectedHubForBooking || hubs[0];
  const cropInfo = CROPS_DATA[selectedCrop] || CROPS_DATA.onion;

  const ratePerQtlDay = currentHub.pricingPerQuintalDay;
  const baseStorageCost = Math.round(quantityQuintals * ratePerQtlDay * durationDays);
  const iotTelemetryFee = Math.round(quantityQuintals * 0.20 * durationDays); // ₹0.20/qtl/day
  const totalCost = baseStorageCost + iotTelemetryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createBookingRequest({
      farmerName,
      farmerPhone,
      farmerLocation,
      cropId: selectedCrop,
      cropName: cropInfo.name,
      quantityQuintals: Number(quantityQuintals),
      hubId: currentHub.id,
      hubName: currentHub.name,
      startDate,
      durationDays: Number(durationDays),
      totalEstimatedCost: totalCost,
      notes: notes || `Direct reservation via KisanSeva App. Desired setpoint: ${cropInfo.idealTemp}°C / ${cropInfo.idealHumidity}% RH.`
    });

    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      closeBookingModal();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              Request Storage Bay Reservation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {currentHub.name} • {currentHub.location}
            </p>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              Storage Bay Request Dispatched!
            </h4>
            <p className="text-sm text-slate-300 max-w-md">
              Your request for <strong className="text-emerald-400">{quantityQuintals} Quintals</strong> of{' '}
              <strong className="text-white">{cropInfo.name}</strong> has been transmitted to {currentHub.name}.
            </p>
            <span className="text-xs text-slate-500 mt-3 font-mono">
              Redirecting & updating local state...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Farmer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farmer / Producer Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (WhatsApp Enabled)
                </label>
                <input
                  type="text"
                  required
                  value={farmerPhone}
                  onChange={e => setFarmerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Crop & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Commodity Crop
                </label>
                <select
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value as CropId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {Object.values(CROPS_DATA).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.variety.split('/')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deposit Quantity (Quintals)
                </label>
                <input
                  type="number"
                  min="5"
                  max={currentHub.availableCapacityQuintals}
                  required
                  value={quantityQuintals}
                  onChange={e => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Available in Hub: {currentHub.availableCapacityQuintals} Qtl
                </span>
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deposit Intake Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Planned Storage Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="7"
                    max="300"
                    required
                    value={durationDays}
                    onChange={e => setDurationDays(Math.max(7, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-1">
                    {[30, 60, 90].map(d => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDurationDays(d)}
                        className={`px-2 py-1 rounded text-[11px] font-mono border ${
                          durationDays === d
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Crop Specific Setpoint Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-300 font-medium">Automatic Cold Profile Lock</span>
                  <p className="text-[11px] text-slate-500">
                    Optimized for {cropInfo.name}: <strong>{cropInfo.idealTemp}°C</strong> & <strong>{cropInfo.idealHumidity}% RH</strong>
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800/60">
                Precision Dark Bay
              </span>
            </div>

            {/* Cost Breakdown Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Base Dark Storage ({quantityQuintals} qtl × {durationDays} days × ₹{ratePerQtlDay}/day)</span>
                <span className="font-mono text-slate-200">₹{baseStorageCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>IoT Precision Micro-climate & Ozone Guard (₹0.20/qtl/day)</span>
                <span className="font-mono text-slate-200">₹{iotTelemetryFee.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Estimated Storage Cost</span>
                <span className="text-lg font-mono text-emerald-400">
                  ₹{totalCost.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 italic text-right">
                *Payable post-intake via UPI, e-NAM or Kisan Credit Card (KCC)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Confirm & Dispatch Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
