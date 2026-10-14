import React from 'react';
import { IconPlay, IconEdit, IconTrash, IconClock, IconDumbbell, IconChevronRight } from './Icons';

export default function RoutineCard({ routine, exercisesMap, onStartWorkout, onEdit, onDelete }) {
  // Resolve exercises from map
  const routineExercises = (routine.exercises || [])
    .map((item) => ({
      ...item,
      details: exercisesMap[item.exerciseId] || null,
    }))
    .filter((item) => item.details !== null);

  const totalSets = routineExercises.reduce((acc, curr) => acc + (Number(curr.sets) || 3), 0);
  const estimatedMinutes = Math.round(totalSets * 2.2);

  return (
    <div className="group relative bg-[#12131a] hover:bg-[#151722] border border-[#222533] hover:border-[#33384c] rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
            {routine.tag || 'Ficha'}
          </span>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(routine)}
                className="p-1.5 rounded-lg bg-[#1a1c27] hover:bg-[#ccff00] text-gray-400 hover:text-black transition"
                title="Editar rotina"
              >
                <IconEdit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(routine.id)}
                className="p-1.5 rounded-lg bg-[#1a1c27] hover:bg-red-500 text-gray-400 hover:text-white transition"
                title="Excluir rotina"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-display font-black text-white group-hover:text-[#ccff00] transition mb-1">
          {routine.title}
        </h3>
        {routine.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {routine.description}
          </p>
        )}

        {/* Routine Stats Bar */}
        <div className="flex items-center gap-4 text-xs text-gray-400 py-2.5 px-3.5 bg-[#171924] rounded-xl mb-4 border border-[#222535]">
          <div className="flex items-center gap-1.5">
            <IconDumbbell className="w-4 h-4 text-[#ccff00]" />
            <span><strong className="text-white font-bold">{routineExercises.length}</strong> exercícios</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-600" />
          <div className="flex items-center gap-1.5">
            <IconClock className="w-4 h-4 text-[#00f0ff]" />
            <span>~<strong className="text-white font-bold">{estimatedMinutes}</strong> min</span>
          </div>
        </div>

        {/* Exercises list preview */}
        <div className="space-y-2 mb-6">
          {routineExercises.slice(0, 4).map((item, idx) => (
            <div
              key={`${item.exerciseId}-${idx}`}
              className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#161824]/60 hover:bg-[#1a1c2b] transition"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-5 h-5 rounded-md bg-[#222536] text-[11px] font-bold text-gray-400 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-gray-200 font-medium truncate">
                  {item.details.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-gray-400 font-semibold">
                  {item.sets || 3}x {item.reps || '10-12'}
                </span>
                <span className="text-[10px] font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.5 rounded border border-[#00f0ff]/20">
                  ⏱️ {item.restSeconds || item.details?.restSeconds || 60}s
                </span>
              </div>
            </div>
          ))}
          {routineExercises.length > 4 && (
            <p className="text-[11px] text-gray-400 text-center font-medium pt-1">
              + {routineExercises.length - 4} outros exercícios na ficha
            </p>
          )}
        </div>
      </div>

      {/* Start Workout CTA */}
      <button
        type="button"
        onClick={() => onStartWorkout(routine)}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-98 text-black font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-[#ccff00]/15 flex items-center justify-center gap-2 transition group/btn"
      >
        <IconPlay className="w-4 h-4 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
        Iniciar Treino
      </button>
    </div>
  );
}
