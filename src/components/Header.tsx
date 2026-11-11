import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { Compass, Check, Plane, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
  const { currentTrip, currentTripId, setTripId, allTrips } = useTrip();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header 
      className="relative pt-6 pb-5 px-6 border-b border-black/10 transition-colors duration-500 shadow-md"
      style={{ backgroundColor: currentTrip.themeColor }}
    >
      <div className="flex flex-col gap-3">
        {/* Subtitle */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-white/80 font-mono text-[9px] tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
            <div className="w-4 h-[1px] bg-white/50" />
            {currentTrip.country} // {currentTrip.name}
          </span>
        </div>

        {/* Main Title & Change Modal Button */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col text-left">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tighter uppercase text-white drop-shadow-xs">
              {currentTrip.cityEn} <span className="text-white/30">{currentTrip.year}</span>
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/25 hover:bg-black/35 border border-white/20 rounded-full text-white text-xs font-bold tracking-wider backdrop-blur-xs transition-all active:scale-95 mb-1 shadow-xs"
            title="切換目的地"
          >
            <span>{currentTrip.flag} {currentTrip.name}</span>
            <Compass className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Sub Details Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1 pt-2 border-t border-white/10">
          <div className="text-xs sm:text-sm font-bold text-white/90 font-mono">{currentTrip.dateRange}</div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="px-2 py-0.5 border border-white/20 rounded-full text-[9px] uppercase tracking-widest bg-white/10 font-bold text-white">
              {currentTrip.tagSeason}
            </span>
            <span className="px-2 py-0.5 border border-white/20 rounded-full text-[9px] uppercase tracking-widest bg-black/25 font-bold text-white">
              {currentTrip.durationLabel}
            </span>
            <span className="px-2 py-0.5 border border-white/20 rounded-full text-[9px] uppercase tracking-widest bg-black/30 font-mono font-bold text-amber-200">
              {currentTrip.currency} ({currentTrip.currencySymbol})
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Background Text */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.08] text-[100px] sm:text-[120px] font-black leading-none pointer-events-none select-none text-white tracking-tighter">
        {currentTrip.bgCode}
      </div>

      {/* Full Modal Switcher (Never clipped by header overflow) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-100">
                    選擇旅遊目的地
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Cards List */}
              <div className="p-4 space-y-3">
                {allTrips.map(trip => {
                  const isSelected = trip.id === currentTripId;
                  return (
                    <button
                      key={trip.id}
                      onClick={() => {
                        setTripId(trip.id);
                        setIsModalOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group relative overflow-hidden",
                        isSelected
                          ? "border-amber-400/80 bg-gradient-to-r from-amber-500/20 via-zinc-800 to-zinc-800 shadow-md ring-1 ring-amber-400/40"
                          : "border-zinc-800 bg-zinc-800/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
                      )}
                    >
                      <div className="flex items-center gap-3.5 z-10">
                        <span className="text-3xl leading-none drop-shadow-xs">{trip.flag}</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-white">{trip.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-700/80 text-zinc-300 uppercase tracking-wider">
                              {trip.durationLabel}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 mt-0.5 font-mono">
                            {trip.dateRange} // {trip.currency} ({trip.currencySymbol})
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shrink-0 z-10 shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0 z-10">
                          切換 ➔
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-zinc-950/80 text-center border-t border-zinc-800/80">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  即時切換行程與個人/團體記帳帳本
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
