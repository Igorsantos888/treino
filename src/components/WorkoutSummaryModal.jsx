import React, { useEffect } from 'react';
import { IconTrophy, IconClock, IconDumbbell, IconFlame, IconCheck } from './Icons';
import { fireConfetti } from '../utils/confetti';

export default function WorkoutSummaryModal({ summary, onClose }) {
  useEffect(() => {
    fireConfetti();
    const timeout = setTimeout(() => {
      fireConfetti();
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  if (!summary) return null;

  const mins = Math.floor(summary.durationSeconds / 60);
  const secs = summary.durationSeconds % 60;
  const timeFormatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12131a] border border-[#2b2e40] rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden animate-scale-up">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#ccff00]/15 blur-3xl pointer-events-none" />

        {/* Trophy Icon */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-[#ccff00] text-black flex items-center justify-center shadow-2xl shadow-[#ccff00]/30 mb-5">
          <IconTrophy className="w-10 h-10 stroke-[2.2]" />
        </div>

        {/* Motivational Header */}
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 inline-block mb-2">
          Treino Finalizado
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
          Excelente Treino!
        </h2>
        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
          Você completou o <strong className="text-white">{summary.routineTitle}</strong> com consistência impecável.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-6">
          {/* Duration */}
          <div className="bg-[#171924] border border-[#242738] p-4 rounded-2xl">
            <IconClock className="w-5 h-5 text-[#ccff00] mx-auto mb-1" />
            <span className="block text-[10px] uppercase font-bold text-gray-400">Tempo Total</span>
            <span className="font-display font-black text-xl text-white">{timeFormatted}</span>
          </div>

          {/* Volume */}
          <div className="bg-[#171924] border border-[#242738] p-4 rounded-2xl">
            <IconDumbbell className="w-5 h-5 text-[#00f0ff] mx-auto mb-1" />
            <span className="block text-[10px] uppercase font-bold text-gray-400">Volume Total</span>
            <span className="font-display font-black text-xl text-white">
              {summary.totalVolumeKg.toLocaleString('pt-BR')} kg
            </span>
          </div>

          {/* Sets Done */}
          <div className="bg-[#171924] border border-[#242738] p-4 rounded-2xl">
            <IconCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="block text-[10px] uppercase font-bold text-gray-400">Séries Feitas</span>
            <span className="font-display font-black text-xl text-white">
              {summary.totalSetsCompleted} / {summary.totalSets}
            </span>
          </div>

          {/* Exercises */}
          <div className="bg-[#171924] border border-[#242738] p-4 rounded-2xl">
            <IconFlame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <span className="block text-[10px] uppercase font-bold text-gray-400">Exercícios</span>
            <span className="font-display font-black text-xl text-white">
              {summary.exercisesData ? summary.exercisesData.length : 0}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-98 text-black font-display font-black text-base uppercase tracking-wider shadow-xl shadow-[#ccff00]/25 transition"
        >
          Salvar no Histórico
        </button>
      </div>
    </div>
  );
}
