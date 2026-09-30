import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Check, 
  X
} from 'lucide-react';

export const BookingRequests: React.FC = () => {
  const { 
    bookingRequests, 
    approveBookingRequest, 
    rejectBookingRequest, 
    bays,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedBayAllocations, setSelectedBayAllocations] = useState<Record<string, string>>({});
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Capacity at limit for requested temperature profile');

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
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border-slate-800'
          : 'bg-gradient-to-r from-cyan-50 via-white to-indigo-50 border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
              <Inbox className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Space Requests & Booking Management
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Review incoming reservation requests from regional farmers and allocate certified dark storage bays.
          </p>
        </div>

        {/* Filter Pills */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
        }`}>
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Action' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Declined' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
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
          <div className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              No Booking Requests Found
            </h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Switch to Farmer Portal to simulate submitting a new reservation request!
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark
                    ? isPending
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : isApproved
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 opacity-70'
                    : isPending
                    ? 'bg-white border-cyan-300 shadow-md shadow-cyan-100'
                    : isApproved
                    ? 'bg-white border-emerald-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                {/* Farmer & Lot Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isDark ? 'text-slate-400 bg-slate-950 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-300'
                    }`}>
                      #{req.id}
                    </span>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {req.farmerName}
                    </h4>
                    <span className={`text-xs flex items-center gap-1 font-mono ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Phone className="w-3 h-3" />
                      {req.farmerPhone}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400 animate-pulse'
                        : isApproved
                        ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                        : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <div className={`flex flex-wrap items-center gap-4 text-xs ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span>
                      Commodity: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{req.cropName}</strong>
                    </span>
                    <span>
                      Volume: <strong className="font-mono">{req.quantityQuintals} Quintals</strong>
                    </span>
                    <span>
                      Duration: <strong className="font-mono">{req.durationDays} Days</strong>
                    </span>
                    <span>
                      Intake Date: <strong className="font-mono">{req.startDate}</strong>
                    </span>
                  </div>

                  {req.notes && (
                    <p className={`text-xs p-2.5 rounded-xl border leading-relaxed ${
                      isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <span className="font-bold">Farmer Special Instructions:</span> {req.notes}
                    </p>
                  )}

                  {req.rejectionReason && (
                    <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/20 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
                      <strong>Decline Reason:</strong> {req.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Right: Allocation & Action Controls */}
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-5 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div className="text-left sm:text-right">
                    <span className={`text-[10px] uppercase tracking-wider block font-bold ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Total Invoice Value
                    </span>
                    <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{req.totalEstimatedCost.toLocaleString()}
                    </span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Submitted: {req.createdAt}
                    </span>
                  </div>

                  {/* Actions for Pending Requests */}
                  {isPending && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div>
                        <label className={`block text-[10px] font-bold mb-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Allocate Target Bay:
                        </label>
                        <select
                          value={selectedBayAllocations[req.id] || (availableBays[0]?.id || bays[0].id)}
                          onChange={e => setSelectedBayAllocations({
                            ...selectedBayAllocations,
                            [req.id]: e.target.value
                          })}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
                            isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                          }`}
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
                          className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectionModalId(req.id)}
                          className={`py-1.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border-slate-700 hover:border-rose-500/40'
                              : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-300 hover:border-rose-300'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isApproved && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-2xl p-5 space-y-4 border ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            <h4 className="text-base font-bold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              Decline Storage Request
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Please specify the operational reason for declining this request. The farmer will be notified immediately.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalId(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
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
