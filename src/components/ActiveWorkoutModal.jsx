import React, { useState } from 'react';
import { IconClock, IconCheck, IconX, IconPlus, IconFlame, IconMaximize, IconChevronDown } from './Icons';
import RestTimer from './RestTimer';
import ImagePreviewModal from './ImagePreviewModal';
import { sound } from '../utils/audio';

export default function ActiveWorkoutModal({
  session,
  onUpdateWorkoutData,
  onMinimize,
  onFinishWorkout,
  onCancelWorkout,
}) {
  const [activeRestSeconds, setActiveRestSeconds] = useState(null);
  const [previewExercise, setPreviewExercise] = useState(null);

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
    return `${displayMins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toggle set completed (immutable)
  const handleToggleSet = (exIdx, setIdx) => {
    sound.playSetComplete();

    let triggerRest = false;
    let restDuration = 60;

    const updatedData = workoutData.map((exercise, eI) => {
      if (eI !== exIdx) return exercise;
      const updatedSets = exercise.sets.map((set, sI) => {
        if (sI !== setIdx) return set;
        const nextStatus = !set.completed;
        if (nextStatus) {
          triggerRest = true;
          restDuration = exercise.restSeconds || 60;
        }
        return { ...set, completed: nextStatus };
      });
      return { ...exercise, sets: updatedSets };
    });

    onUpdateWorkoutData(updatedData);

    if (triggerRest) {
      setActiveRestSeconds(restDuration);
    }
  };

  // Update weight or reps for a set (immutable)
  const handleUpdateSet = (exIdx, setIdx, field, value) => {
    const updatedData = workoutData.map((exercise, eI) => {
      if (eI !== exIdx) return exercise;
      const updatedSets = exercise.sets.map((set, sI) =>
        sI === setIdx ? { ...set, [field]: value } : set
      );
      return { ...exercise, sets: updatedSets };
    });
    onUpdateWorkoutData(updatedData);
  };

  // Add extra set to an exercise (pure immutable - exactly 1 set per click)
  const handleAddSet = (exIdx) => {
    const updatedData = workoutData.map((exercise, eI) => {
      if (eI !== exIdx) return exercise;
      const currentSets = exercise.sets || [];
      const lastSet = currentSets[currentSets.length - 1] || { weight: 20, reps: 10 };
      const newSet = {
        setNumber: currentSets.length + 1,
        weight: lastSet.weight,
        reps: lastSet.reps,
        completed: false,
      };
      return {
        ...exercise,
        sets: [...currentSets, newSet],
      };
    });
    onUpdateWorkoutData(updatedData);
  };

  // Remove set from an exercise (immutable)
  const handleRemoveSet = (exIdx, setIdx) => {
    const updatedData = workoutData.map((exercise, eI) => {
      if (eI !== exIdx) return exercise;
      const filtered = exercise.sets
        .filter((_, sI) => sI !== setIdx)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      return { ...exercise, sets: filtered };
    });
    onUpdateWorkoutData(updatedData);
  };

  // Calculate totals
  const allSets = workoutData.flatMap((ex) => ex.sets || []);
  const completedSetsCount = allSets.filter((s) => s.completed).length;
  const progressPercent = allSets.length > 0 ? (completedSetsCount / allSets.length) * 100 : 0;

  // Total volume (kg * reps for completed sets)
  const totalVolumeKg = allSets
    .filter((s) => s.completed)
    .reduce((acc, curr) => acc + (Number(curr.weight) || 0) * (Number(curr.reps) || 0), 0);

  const handleFinish = () => {
    sound.playVictory();
    const summary = {
      id: `log-${Date.now()}`,
      routineId: routine.id,
      routineTitle: routine.title,
      routineTag: routine.tag,
      date: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg,
      totalSetsCompleted: completedSetsCount,
      totalSets: allSets.length,
      exercisesData: workoutData,
    };
    onFinishWorkout(summary);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] text-white flex flex-col overflow-hidden animate-fade-in">
      {/* Top Athletic Bar */}
      <div className="bg-[#12131a] border-b border-[#222535] px-3 sm:px-6 py-2.5 sm:py-3 shadow-lg shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Flame Icon + Timer & Sets (Title on Desktop only) */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ccff00] text-black flex items-center justify-center font-black shrink-0 shadow-md shadow-[#ccff00]/10">
              <IconFlame className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              {/* Routine title - Desktop only */}
              <div className="hidden sm:flex items-center gap-2">
                <h2 className="font-display font-black text-base sm:text-lg text-white leading-tight truncate">
                  {routine.title}
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20 shrink-0">
                  Ao Vivo
                </span>
              </div>

              {/* Timer & Sets Count (Spacious on Mobile) */}
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 rounded-lg bg-[#181a26] border border-[#272a3a] font-mono font-bold text-white flex items-center gap-1.5 text-xs">
                  <IconClock className="w-3.5 h-3.5 text-[#ccff00]" />
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="text-gray-400 text-xs">
                  <strong className="text-white font-bold">{completedSetsCount}</strong>/{allSets.length} séries
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Minimizar, Desistir, Concluir) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Minimizar */}
            <button
              type="button"
              onClick={onMinimize}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-[#171926] hover:bg-[#222538] flex items-center gap-1 transition border border-[#282c3f]"
              title="Minimizar treino (seu progresso continua salvo)"
            >
              <IconChevronDown className="w-4 h-4 text-[#ccff00]" />
              <span className="hidden sm:inline">Minimizar</span>
            </button>

            {/* Desistir: X on mobile, Text on desktop */}
            <button
              type="button"
              onClick={onCancelWorkout}
              className="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition border border-transparent sm:border-[#262838]"
              title="Desistir do treino"
            >
              <IconX className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Desistir</span>
            </button>

            {/* Concluir: Checkmark on mobile, Text on desktop */}
            <button
              type="button"
              onClick={handleFinish}
              className="w-10 h-10 sm:w-auto sm:px-5 sm:py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#ccff00]/20 flex items-center justify-center gap-1.5 transition"
              title="Concluir Treino"
            >
              <IconCheck className="w-5 h-5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="hidden sm:inline">Concluir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#1b1e2c] h-1 shrink-0">
        <div
          className="bg-[#ccff00] h-full transition-all duration-300 shadow-[0_0_10px_#ccff00]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Exercises Workout Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 max-w-4xl w-full mx-auto space-y-4 sm:space-y-6">
        {workoutData.map((exercise, exIdx) => {
          const completedInThisEx = (exercise.sets || []).filter((s) => s.completed).length;

          return (
            <div
              key={`${exercise.exerciseId}-${exIdx}`}
              className="bg-[#12131a] border border-[#222535] rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Exercise Header */}
              <div className="p-3.5 sm:p-5 flex items-start sm:items-center justify-between border-b border-[#1f2231] bg-[#161822] gap-2.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Clickable Expandable Thumbnail */}
                  <button
                    type="button"
                    onClick={() => setPreviewExercise(exercise)}
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-black shrink-0 border border-[#2a2d3d] hover:border-[#ccff00] transition group/thumb cursor-pointer shadow-md focus:outline-none"
                    title="Clique para ampliar o exercício e ver orientações"
                  >
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover/thumb:scale-115 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <IconMaximize className="w-4 h-4 sm:w-5 sm:h-5 text-[#ccff00]" />
                    </div>
                  </button>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-black text-sm sm:text-lg text-white leading-snug line-clamp-2">
                      {exercise.name}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mt-1 flex-wrap">
                      <span className="uppercase text-[9px] sm:text-[10px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.5 rounded-md">
                        {exercise.muscle}
                      </span>
                      <span>Descanso: {exercise.restSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Progress Chip */}
                <div className="text-right shrink-0 bg-[#0d0e14] border border-[#252838] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Progresso</span>
                  <span className="font-display font-black text-xs sm:text-sm text-[#ccff00]">
                    {completedInThisEx}/{(exercise.sets || []).length}
                  </span>
                </div>
              </div>

              {/* Sets Table */}
              <div className="p-3 sm:p-5">
                {/* Header columns with rigid grid */}
                <div className="grid grid-cols-[32px_1fr_1fr_40px] sm:grid-cols-[40px_1fr_1fr_48px] gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 pb-2 px-1 border-b border-[#222535]">
                  <div className="text-center">#</div>
                  <div className="text-center">Carga (kg)</div>
                  <div className="text-center">Reps Feitas</div>
                  <div className="text-center">OK</div>
                </div>

                <div className="space-y-2 mt-2">
                  {(exercise.sets || []).map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-[32px_1fr_1fr_40px] sm:grid-cols-[40px_1fr_1fr_48px] gap-2 items-center p-1.5 sm:p-2 rounded-2xl transition-all duration-200 ${
                        set.completed
                          ? 'bg-[#152319] border border-[#10b981]/30'
                          : 'bg-[#161824] border border-[#232637]'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="flex items-center justify-center">
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl font-display font-black text-xs flex items-center justify-center ${
                            set.completed ? 'bg-[#10b981] text-black' : 'bg-[#222538] text-gray-300'
                          }`}
                        >
                          {set.setNumber}
                        </span>
                      </div>

                      {/* Weight input */}
                      <div className="min-w-0">
                        <div className="flex items-center justify-center bg-[#0d0e14] border border-[#2b2e40] rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 focus-within:border-[#ccff00] w-full">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weight}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', e.target.value)}
                            className="w-full min-w-0 bg-transparent text-center font-display font-black text-xs sm:text-sm text-white outline-none"
                          />
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold ml-0.5 sm:ml-1 shrink-0">kg</span>
                        </div>
                      </div>

                      {/* Reps input */}
                      <div className="min-w-0">
                        <div className="flex items-center justify-center bg-[#0d0e14] border border-[#2b2e40] rounded-xl px-1.5 sm:px-2.5 py-1 sm:py-1.5 focus-within:border-[#ccff00] w-full">
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                            className="w-full min-w-0 bg-transparent text-center font-display font-black text-xs sm:text-sm text-[#ccff00] outline-none"
                          />
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold ml-0.5 sm:ml-1 shrink-0">reps</span>
                        </div>
                      </div>

                      {/* Check Button & Remove Action */}
                      <div className="flex items-center justify-center relative">
                        <button
                          type="button"
                          onClick={() => handleToggleSet(exIdx, setIdx)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition transform active:scale-90 ${
                            set.completed
                              ? 'bg-[#10b981] text-black shadow-md shadow-[#10b981]/20'
                              : 'bg-[#222538] hover:bg-[#2f334a] text-gray-400 hover:text-white'
                          }`}
                          title="Marcar série como concluída"
                        >
                          <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                        </button>

                        {/* Remove set if more than 1 set (corner docked) */}
                        {(exercise.sets || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-[#1f2231] hover:bg-red-500 text-gray-400 hover:text-white flex items-center justify-center transition text-[10px] shadow border border-[#2d3142]"
                            title="Remover série"
                          >
                            <IconX className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Extra Set */}
                <button
                  type="button"
                  onClick={() => handleAddSet(exIdx)}
                  className="mt-3 w-full py-2 border border-dashed border-[#292d3e] hover:border-[#ccff00]/60 rounded-xl text-xs font-bold text-gray-400 hover:text-[#ccff00] flex items-center justify-center gap-1.5 transition"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  Adicionar Série Extra
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Rest Timer */}
      {activeRestSeconds !== null && (
        <RestTimer
          initialSeconds={activeRestSeconds}
          onClose={() => setActiveRestSeconds(null)}
        />
      )}

      {/* Image Expansion Modal */}
      <ImagePreviewModal
        exercise={previewExercise}
        isOpen={Boolean(previewExercise)}
        onClose={() => setPreviewExercise(null)}
      />
    </div>
  );
}
