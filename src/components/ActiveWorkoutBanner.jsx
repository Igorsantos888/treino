import React from 'react';
import { IconFlame, IconClock, IconPlay, IconX, IconCheck } from './Icons';

export default function ActiveWorkoutBanner({ session, onResume, onCancel }) {
  if (!session || !session.routine) return null;

  const { routine, workoutData = [], elapsedSeconds = 0 } = session;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}h ${displayMins < 10 ? '0' : ''}${displayMins}m ${s < 10 ? '0' : ''}${s}s`;
    }
    return `${displayMins < 10 ? '0' : ''}${displayMins}:${s < 10 ? '0' : ''}${s}`;
  };

  const allSets = workoutData.flatMap((ex) => ex.sets || []);
  const completedSetsCount = allSets.filter((s) => s.completed).length;
  const progressPercent = allSets.length > 0 ? (completedSetsCount / allSets.length) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-[#171a26] via-[#1c2030] to-[#171a26] border-y border-[#ccff00]/30 shadow-2xl relative overflow-hidden animate-fade-in z-30">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[#ccff00]/5 pointer-events-none" />

      {/* Thin top progress line */}
      <div className="w-full bg-[#202334] h-1">
        <div
          className="bg-[#ccff00] h-full transition-all duration-300 shadow-[0_0_8px_#ccff00]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Indicator & Routine Info */}
          <div
            onClick={onResume}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
            title="Clique para voltar para o treino"
          >
            {/* Pulsing Flame Icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#ccff00]/25 group-hover:scale-105 transition-transform">
                <IconFlame className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ccff00]"></span>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-full">
                  Treino em Andamento
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">• Clique para retornar</span>
              </div>
              <h4 className="font-display font-black text-white text-sm sm:text-base group-hover:text-[#ccff00] transition truncate mt-0.5">
                {routine.title}
              </h4>
            </div>
          </div>

          {/* Right: Live Timer, Progress & CTA Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {/* Timer badge */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-[#0f1017] border border-[#2b2f42] font-mono font-bold text-white flex items-center gap-1.5 shadow-inner">
                <IconClock className="w-3.5 h-3.5 text-[#ccff00]" />
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-gray-400 text-xs">
                <strong className="text-white font-bold">{completedSetsCount}</strong>/{allSets.length} séries
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs font-bold"
                title="Desistir deste treino"
              >
                <IconX className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Desistir</span>
              </button>

              <button
                type="button"
                onClick={onResume}
                className="px-4 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#ccff00]/20 flex items-center gap-1.5 transition"
              >
                <IconPlay className="w-3.5 h-3.5 fill-current" />
                <span>Voltar ao Treino</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
