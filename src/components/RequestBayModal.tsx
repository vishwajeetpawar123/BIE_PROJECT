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
    hubs,
    theme
  } = useApp();

  const isDark = theme === 'dark';

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

  const inputClass = isDark
    ? 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500'
    : 'w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs';

  const labelClass = isDark
    ? 'block text-xs font-semibold text-slate-300 mb-1'
    : 'block text-xs font-semibold text-slate-700 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div>
            <h3 className={`text-base font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Package className="w-5 h-5 text-emerald-500" />
              Request Storage Bay Reservation
            </h3>
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentHub.name} • {currentHub.location}
            </p>
          </div>
          <button
            onClick={closeBookingModal}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Storage Bay Request Dispatched!
            </h4>
            <p className={`text-sm max-w-md ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Your request for <strong className="text-emerald-500">{quantityQuintals} Quintals</strong> of{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{cropInfo.name}</strong> has been transmitted to {currentHub.name}.
            </p>
            <span className="text-xs text-slate-400 mt-3 font-mono">
              Redirecting & updating local state...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Farmer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Farmer / Producer Name</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mobile Number (WhatsApp Enabled)</label>
                <input
                  type="text"
                  required
                  value={farmerPhone}
                  onChange={e => setFarmerPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Crop & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Commodity Crop</label>
                <select
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value as CropId)}
                  className={inputClass}
                >
                  {Object.values(CROPS_DATA).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.variety.split('/')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Deposit Quantity (Quintals)</label>
                <input
                  type="number"
                  min="5"
                  max={currentHub.availableCapacityQuintals}
                  required
                  value={quantityQuintals}
                  onChange={e => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
                  className={inputClass}
                />
                <span className={`text-[10px] mt-0.5 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Available in Hub: {currentHub.availableCapacityQuintals} Qtl
                </span>
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Deposit Intake Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Planned Storage Duration (Days)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="7"
                    max="300"
                    required
                    value={durationDays}
                    onChange={e => setDurationDays(Math.max(7, Number(e.target.value)))}
                    className={inputClass}
                  />
                  <div className="flex gap-1">
                    {[30, 60, 90].map(d => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDurationDays(d)}
                        className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                          durationDays === d
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold'
                            : isDark
                            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Setpoint Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Automatic Cold Profile Lock
                  </span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Optimized for {cropInfo.name}: <strong>{cropInfo.idealTemp}°C</strong> & <strong>{cropInfo.idealHumidity}% RH</strong>
                  </p>
                </div>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/80 px-2 py-1 rounded border border-emerald-300 dark:border-emerald-800/60">
                Precision Dark Bay
              </span>
            </div>

            {/* Cost Breakdown Card */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark 
                ? 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800' 
                : 'bg-slate-50 border-slate-200 shadow-2xs'
            }`}>
              <div className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Base Dark Storage ({quantityQuintals} qtl × {durationDays} days × ₹{ratePerQtlDay}/day)</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  ₹{baseStorageCost.toLocaleString()}
                </span>
              </div>
              <div className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>IoT Precision Micro-climate & Ozone Guard (₹0.20/qtl/day)</span>
                <span className={`font-mono font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  ₹{iotTelemetryFee.toLocaleString()}
                </span>
              </div>
              <div className={`pt-2 border-t flex justify-between items-center text-sm font-bold ${
                isDark ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'
              }`}>
                <span>Total Estimated Storage Cost</span>
                <span className="text-lg font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{totalCost.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic text-right">
                *Payable post-intake via UPI, e-NAM or Kisan Credit Card (KCC)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeBookingModal}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
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
