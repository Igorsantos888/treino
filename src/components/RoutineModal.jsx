import React, { useState, useEffect } from 'react';
import { IconX, IconPlus, IconTrash, IconDumbbell, IconSearch, IconCheck } from './Icons';

export default function RoutineModal({ isOpen, onClose, onSave, allExercises, routineToEdit = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Hipertrofia');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (routineToEdit) {
      setTitle(routineToEdit.title || '');
      setDescription(routineToEdit.description || '');
      setTag(routineToEdit.tag || 'Hipertrofia');
      setSelectedExercises(
        (routineToEdit.exercises || []).map((item) => ({
          exerciseId: item.exerciseId,
          sets: item.sets || 3,
          reps: item.reps || '10 - 12',
          weight: item.weight || 0,
          restSeconds: item.restSeconds || 60,
        }))
      );
    } else {
      setTitle('');
      setDescription('');
      setTag('Hipertrofia');
      setSelectedExercises([]);
    }
    setSearchTerm('');
  }, [routineToEdit, isOpen]);

  if (!isOpen) return null;

  const exercisesMap = allExercises.reduce((acc, ex) => {
    acc[ex.id] = ex;
    return acc;
  }, {});

  const addExerciseToRoutine = (ex) => {
    setSelectedExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        sets: ex.sets || 3,
        reps: ex.reps || '10 - 12',
        weight: ex.weight || 0,
        restSeconds: ex.restSeconds || 60,
      },
    ]);
  };

  const removeExerciseFromRoutine = (index) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExerciseProperty = (index, prop, value) => {
    setSelectedExercises((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [prop]: value } : item))
    );
  };

  const filteredLibrary = allExercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.muscle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const routineData = {
      id: routineToEdit ? routineToEdit.id : `routine-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim() || 'Geral',
      exercises: selectedExercises,
    };

    onSave(routineData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#12131a] border border-[#252839] rounded-3xl shadow-2xl overflow-hidden my-6 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222536]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <IconDumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-white">
                {routineToEdit ? 'Editar Ficha de Treino' : 'Nova Ficha de Treino'}
              </h2>
              <p className="text-xs text-gray-400">Monte sua rotina de exercícios com séries e repetições</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1f2231] transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Título do Treino <span className="text-[#ccff00]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Treino A — Peito & Tríceps"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Categoria / Tag
              </label>
              <input
                type="text"
                placeholder="Ex: Empurrar, Puxar, Pernas"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Descrição ou Objetivo
            </label>
            <input
              type="text"
              placeholder="Ex: Foco em hipertrofia e progressão de carga no supino..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition"
            />
          </div>

          {/* Routine Exercises List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Exercícios Desta Ficha ({selectedExercises.length})
              </label>
              <span className="text-[11px] text-[#ccff00] font-semibold">
                Adicione exercícios da biblioteca abaixo
              </span>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="border-2 border-dashed border-[#26293a] rounded-2xl p-8 text-center text-gray-400">
                <IconDumbbell className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                <p className="text-sm font-medium">Nenhum exercício adicionado a esta ficha ainda.</p>
                <p className="text-xs text-gray-400 mt-1">Busque e clique em um exercício da biblioteca abaixo para adicioná-lo.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedExercises.map((item, idx) => {
                  const exDetails = exercisesMap[item.exerciseId];
                  if (!exDetails) return null;

                  return (
                    <div
                      key={`${item.exerciseId}-${idx}`}
                      className="bg-[#161825] border border-[#282b3e] rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#222538] text-xs font-bold text-gray-300 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                          <img
                            src={exDetails.imageUrl}
                            alt={exDetails.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{exDetails.name}</h4>
                          <span className="text-[10px] uppercase font-bold text-gray-400 bg-[#222538] px-2 py-0.5 rounded-md">
                            {exDetails.muscle}
                          </span>
                        </div>
                      </div>

                      {/* Configurable sets, reps and rest timer per exercise in this routine */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        <div className="flex items-center gap-1 bg-[#10111a] px-2.5 py-1 rounded-xl border border-[#26293a]">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Séries:</span>
                          <input
                            type="number"
                            min="1"
                            max="15"
                            value={item.sets}
                            onChange={(e) => updateExerciseProperty(idx, 'sets', Number(e.target.value))}
                            className="w-10 bg-transparent text-xs font-bold text-white text-center outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1 bg-[#10111a] px-2.5 py-1 rounded-xl border border-[#26293a]">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">Reps:</span>
                          <input
                            type="text"
                            value={item.reps}
                            onChange={(e) => updateExerciseProperty(idx, 'reps', e.target.value)}
                            className="w-16 bg-transparent text-xs font-bold text-[#ccff00] text-center outline-none"
                          />
                        </div>

                        {/* Cronômetro de Descanso configurável */}
                        <div className="flex items-center gap-1 bg-[#10111a] px-2.5 py-1 rounded-xl border border-[#26293a]" title="Tempo de descanso do cronômetro para este exercício">
                          <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                            ⏱️ Descanso:
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="600"
                            step="5"
                            value={item.restSeconds ?? 60}
                            onChange={(e) => updateExerciseProperty(idx, 'restSeconds', Math.max(0, Number(e.target.value)))}
                            className="w-12 bg-transparent text-xs font-bold text-[#00f0ff] text-center outline-none"
                          />
                          <span className="text-[10px] text-gray-400 font-bold">s</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExerciseFromRoutine(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Remover da ficha"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Exercise Picker Library */}
          <div className="space-y-3 pt-4 border-t border-[#222536]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Adicionar da Biblioteca de Exercícios
              </label>
              <div className="relative w-56">
                <IconSearch className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#161824] border border-[#282b3d] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#ccff00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredLibrary.map((ex) => (
                <button
                  type="button"
                  key={ex.id}
                  onClick={() => addExerciseToRoutine(ex)}
                  className="p-2.5 bg-[#151722] hover:bg-[#1c1f2e] border border-[#242738] hover:border-[#ccff00]/50 rounded-xl text-left flex items-center gap-2.5 transition group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0">
                    <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white group-hover:text-[#ccff00] truncate">
                      {ex.name}
                    </h5>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {ex.muscle} • {ex.reps} reps • ⏱️ {ex.restSeconds || 60}s
                    </span>
                  </div>
                  <IconPlus className="w-4 h-4 text-gray-400 group-hover:text-[#ccff00] shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222536]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#1a1c27] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedExercises.length === 0}
              className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 transition active:scale-95"
            >
              <IconCheck className="w-4 h-4" />
              {routineToEdit ? 'Salvar Alterações' : 'Criar Ficha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
