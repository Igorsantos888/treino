import React, { useEffect } from 'react';
import { IconX, IconClock, IconDumbbell } from './Icons';

export default function ImagePreviewModal({ exercise, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !exercise) return null;

  // Safe calculation for sets count (handles both raw number and sets array from active workout)
  const setsCount = Array.isArray(exercise.sets)
    ? exercise.sets.length
    : typeof exercise.sets === 'number' || typeof exercise.sets === 'string'
      ? exercise.sets
      : 4;

  const repsDisplay =
    exercise.reps ||
    (Array.isArray(exercise.sets) && exercise.sets[0]?.reps ? exercise.sets[0].reps : '15');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#12131a] border border-[#272a3d] rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#ccff00] text-white hover:text-black backdrop-blur-md border border-white/10 transition shadow-lg"
          title="Fechar visualização"
        >
          <IconX className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Large Image Container */}
        <div className="relative w-full h-72 sm:h-96 bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
          {exercise.imageUrl ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover sm:object-contain"
            />
          ) : (
            <div className="text-gray-600 flex flex-col items-center gap-2">
              <IconDumbbell className="w-16 h-16 stroke-1" />
              <span className="text-xs">Sem foto disponível</span>
            </div>
          )}

          {/* Muscle Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20">
              {exercise.muscle || 'Exercício'}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#12131a] to-transparent pointer-events-none" />
        </div>

        {/* Exercise Information Body */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-display font-black text-white leading-tight">
              {exercise.name}
            </h3>
            {exercise.notes && (
              <p className="text-sm text-gray-300 mt-2 leading-relaxed bg-[#171924] p-3.5 rounded-2xl border border-[#222536]">
                <strong className="text-[#ccff00] block text-xs uppercase font-extrabold tracking-wider mb-1">
                  Orientação Técnica / Dica de Postura:
                </strong>
                {exercise.notes}
              </p>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#222536]">
            <div className="bg-[#181a26] p-3 rounded-2xl text-center border border-[#252838]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Séries</span>
              <span className="font-display font-extrabold text-base text-white">
                {setsCount}x
              </span>
            </div>

            <div className="bg-[#181a26] p-3 rounded-2xl text-center border border-[#252838]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Repetições</span>
              <span className="font-display font-extrabold text-base text-[#ccff00]">
                {repsDisplay}
              </span>
            </div>

            <div className="bg-[#181a26] p-3 rounded-2xl text-center border border-[#252838]">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Descanso</span>
              <span className="font-display font-extrabold text-base text-white flex items-center justify-center gap-1">
                <IconClock className="w-3.5 h-3.5 text-[#ccff00]" />
                {exercise.restSeconds || 60}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
