import React, { useState } from 'react';
import { IconEdit, IconTrash, IconDumbbell, IconClock, IconRotateCcw, IconMaximize } from './Icons';
import ImagePreviewModal from './ImagePreviewModal';

export default function ExerciseCard({ exercise, onEdit, onDelete, onSelect, isSelected = false }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const muscleBadgeColors = {
    peito: 'bg-red-500/10 text-red-400 border-red-500/20',
    costas: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pernas: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ombros: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    biceps: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    triceps: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    abdomen: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  const badgeClass = muscleBadgeColors[exercise.muscle] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  return (
    <div
      onClick={onSelect ? () => onSelect(exercise) : undefined}
      className={`group relative bg-[#12131a] hover:bg-[#161822] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
        isSelected
          ? 'border-[#ccff00] ring-2 ring-[#ccff00]/40 shadow-lg shadow-[#ccff00]/10'
          : 'border-[#222533] hover:border-[#35394e]'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Exercise Image Header (Click to expand) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsPreviewOpen(true);
        }}
        className="relative w-full h-44 overflow-hidden bg-[#0d0e14] cursor-pointer group/img"
        title="Clique para ver o exercício ampliado"
      >
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Fallback placeholder if broken URL
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1c26] text-gray-500">
            <IconDumbbell className="w-12 h-12 stroke-1 text-gray-600" />
          </div>
        )}

        {/* Hover zoom badge */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <span className="px-3 py-1.5 rounded-full bg-black/75 text-[#ccff00] text-xs font-bold border border-[#ccff00]/40 flex items-center gap-1.5 backdrop-blur-md">
            <IconMaximize className="w-3.5 h-3.5" />
            Ampliar Exercício
          </span>
        </div>

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-black/40 pointer-events-none" />

        {/* Muscle Category Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${badgeClass}`}>
            {exercise.muscle}
          </span>
        </div>

        {/* Action icons (Edit / Delete) */}
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(exercise);
                }}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-[#ccff00] text-gray-300 hover:text-black backdrop-blur-md border border-white/10 transition"
                title="Editar exercício"
              >
                <IconEdit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(exercise.id);
                }}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-red-500 text-gray-300 hover:text-white backdrop-blur-md border border-white/10 transition"
                title="Excluir exercício"
              >
                <IconTrash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exercise Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-[#ccff00] transition line-clamp-1">
            {exercise.name}
          </h3>

          {exercise.notes && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {exercise.notes}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#222533]">
          {/* Sets */}
          <div className="bg-[#181a24] p-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-gray-400">Séries</span>
            <span className="font-display font-extrabold text-sm text-white">{exercise.sets || 3}x</span>
          </div>

          {/* Repetitions */}
          <div className="bg-[#181a24] p-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-gray-400">Repetições</span>
            <span className="font-display font-extrabold text-sm text-[#ccff00]">{exercise.reps || '10-12'}</span>
          </div>

          {/* Weight */}
          <div className="bg-[#181a24] p-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-gray-400">Carga</span>
            <span className="font-display font-extrabold text-sm text-white">
              {exercise.weight ? `${exercise.weight} kg` : 'Peso livre'}
            </span>
          </div>
        </div>

        {/* Rest Timer info */}
        {exercise.restSeconds && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2.5">
            <IconClock className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Descanso sugerido: <strong className="text-gray-200">{exercise.restSeconds}s</strong></span>
          </div>
        )}
      </div>

      {/* Image Preview Lightbox */}
      <ImagePreviewModal
        exercise={exercise}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
