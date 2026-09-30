import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Layers, 
  Check, 
  X,
  Filter,
  Sparkles
} from 'lucide-react';

export const BookingRequests: React.FC = () => {
  const { 
    bookingRequests, 
    approveBookingRequest, 
    rejectBookingRequest, 
    bays 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBayAllocations, setSelectedBayAllocations] = useState<Record<string, string>>({});
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Capacity at limit for requested temperature profile');

  // Available bays that have capacity
  const availableBays = bays.filter(b => b.status === 'available' || b.occupiedQuintals < b.totalCapacityQuintals);

  const filteredRequests = bookingRequests.filter(req => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  const handleApprove = (requestId: string) => {
    const chosenBayId = selectedBayAllocations[requestId] || (availableBays[0]?.id || bays[0].id);
    approveBookingRequest(requestId, chosenBayId);
  };

  const handleRejectConfirm = () => {
    if (rejectionModalId) {
      rejectBookingRequest(rejectionModalId, rejectionReason);
      setRejectionModalId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Inbox className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Space Requests & Booking Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming reservation requests from regional farmers and allocate certified dark storage bays.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Action' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Declined' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-300">
              No Booking Requests Found
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Switch to Farmer Portal to simulate submitting a new reservation request!
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const crop = CROPS_DATA[req.cropId] || CROPS_DATA.onion;
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected';

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl bg-slate-900/90 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending
                    ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : isApproved
                    ? 'border-emerald-500/30'
                    : 'border-slate-800 opacity-70'
                }`}
              >
                {/* Farmer & Lot Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{req.id}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {req.farmerName}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {req.farmerPhone}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-white font-semibold">
                      Commodity: <strong className="text-cyan-400">{req.cropName}</strong>
                    </span>
                    <span>
                      Volume: <strong className="font-mono text-white">{req.quantityQuintals} Quintals</strong>
                    </span>
                    <span>
                      Duration: <strong className="font-mono text-white">{req.durationDays} Days</strong>
                    </span>
                    <span>
                      Intake Date: <strong className="font-mono text-white">{req.startDate}</strong>
                    </span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                      <span className="text-slate-500 font-semibold">Farmer Special Instructions:</span> {req.notes}
                    </p>
                  )}

                  {req.rejectionReason && (
                    <p className="text-xs text-rose-400/90 bg-rose-950/20 p-2 rounded-lg border border-rose-900/40">
                      <strong>Decline Reason:</strong> {req.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Right: Allocation, Billing & Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Total Invoice Value
                    </span>
                    <span className="text-lg font-black font-mono text-emerald-400">
                      ₹{req.totalEstimatedCost.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Submitted: {req.createdAt}
                    </span>
                  </div>

                  {/* Actions for Pending Requests */}
                  {isPending && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {/* Bay Allocation Dropdown */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                          Allocate Target Bay:
                        </label>
                        <select
                          value={selectedBayAllocations[req.id] || (availableBays[0]?.id || bays[0].id)}
                          onChange={e => setSelectedBayAllocations({
                            ...selectedBayAllocations,
                            [req.id]: e.target.value
                          })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          {bays.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.bayNumber} ({b.name.split(' ')[0]}) - {b.occupiedQuintals}/{b.totalCapacityQuintals} Qtl
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectionModalId(req.id)}
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isApproved && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bay Assigned & Intake Active</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Decline Storage Request
            </h4>
            <p className="text-xs text-slate-400">
              Please specify the operational reason for declining this request. The farmer will be notified immediately.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
