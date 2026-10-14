import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExerciseCard from './components/ExerciseCard';
import ExerciseModal from './components/ExerciseModal';
import RoutineCard from './components/RoutineCard';
import RoutineModal from './components/RoutineModal';
import ActiveWorkoutModal from './components/ActiveWorkoutModal';
import ActiveWorkoutBanner from './components/ActiveWorkoutBanner';
import WorkoutSummaryModal from './components/WorkoutSummaryModal';
import HistoryTab from './components/HistoryTab';
import {
  IconFlame,
  IconDumbbell,
  IconPlus,
  IconSearch,
  IconTrophy,
  IconCalendar,
  IconClock,
  IconSparkles,
} from './components/Icons';
import { MUSCLE_GROUPS } from './data/defaultData';
import {
  getStoredExercises,
  saveStoredExercises,
  getStoredRoutines,
  saveStoredRoutines,
  getStoredHistory,
  saveWorkoutToHistory,
  clearStoredHistory,
  getStoredActiveSession,
  saveStoredActiveSession,
  clearStoredActiveSession,
} from './utils/storage';

export default function App() {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [history, setHistory] = useState([]);

  // Navigation
  const [activeTab, setActiveTab] = useState('treinar'); // 'treinar' | 'fichas' | 'exercicios' | 'historico'
  const [selectedMuscle, setSelectedMuscle] = useState('todos');
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Modals
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);

  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState(null);

  // Active Live Workout Session (Persisted in LocalStorage)
  const [activeSession, setActiveSession] = useState(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [completedSummary, setCompletedSummary] = useState(null);

  // Load data on initial render
  const loadAllData = () => {
    setExercises(getStoredExercises());
    setRoutines(getStoredRoutines());
    setHistory(getStoredHistory());

    const storedSession = getStoredActiveSession();
    if (storedSession && storedSession.routine) {
      setActiveSession(storedSession);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Live timer tick across entire app while session is active
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const newSecs = (prev.elapsedSeconds || 0) + 1;
        const updated = {
          ...prev,
          elapsedSeconds: newSecs,
        };
        // Periodic sync to localStorage
        if (newSecs % 4 === 0) {
          saveStoredActiveSession(updated);
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [Boolean(activeSession)]);

  // Quick lookup dictionary for exercises
  const exercisesMap = exercises.reduce((acc, ex) => {
    acc[ex.id] = ex;
    return acc;
  }, {});

  // Exercises Handlers
  const handleSaveExercise = (exerciseData) => {
    let updated;
    const exists = exercises.some((e) => e.id === exerciseData.id);
    if (exists) {
      updated = exercises.map((e) => (e.id === exerciseData.id ? exerciseData : e));
    } else {
      updated = [exerciseData, ...exercises];
    }
    setExercises(updated);
    saveStoredExercises(updated);
    setExerciseToEdit(null);
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      const updated = exercises.filter((e) => e.id !== id);
      setExercises(updated);
      saveStoredExercises(updated);
    }
  };

  // Routines Handlers
  const handleSaveRoutine = (routineData) => {
    let updated;
    const exists = routines.some((r) => r.id === routineData.id);
    if (exists) {
      updated = routines.map((r) => (r.id === routineData.id ? routineData : r));
    } else {
      updated = [routineData, ...routines];
    }
    setRoutines(updated);
    saveStoredRoutines(updated);
    setRoutineToEdit(null);
  };

  const handleDeleteRoutine = (id) => {
    if (window.confirm('Deseja excluir esta ficha de treino?')) {
      const updated = routines.filter((r) => r.id !== id);
      setRoutines(updated);
      saveStoredRoutines(updated);
    }
  };

  // Workout Session Handlers
  const handleStartWorkout = (routine) => {
    // If a different workout is ongoing, ask confirmation
    if (activeSession && activeSession.routine.id !== routine.id) {
      if (
        !window.confirm(
          `Você já tem o treino "${activeSession.routine.title}" em andamento. Deseja cancelar o atual para iniciar este?`
        )
      ) {
        return;
      }
    } else if (activeSession && activeSession.routine.id === routine.id) {
      // Reopen ongoing workout
      setIsWorkoutModalOpen(true);
      return;
    }

    const initialExercises = (routine.exercises || []).map((item) => {
      const details = exercisesMap[item.exerciseId] || {};
      const numSets = Number(item.sets) || 4;
      const parsedReps = parseInt(item.reps) || 15;
      const initialWeight = Number(item.weight) || (Number(details.weight) || 0);

      const setsArray = [];
      for (let i = 1; i <= numSets; i++) {
        setsArray.push({
          setNumber: i,
          weight: initialWeight,
          reps: parsedReps,
          completed: false,
        });
      }

      return {
        exerciseId: item.exerciseId,
        name: details.name || 'Exercício',
        muscle: details.muscle || 'Geral',
        imageUrl: details.imageUrl || '',
        reps: item.reps || details.reps || '15',
        restSeconds: item.restSeconds || details.restSeconds || 60,
        notes: details.notes || '',
        sets: setsArray,
      };
    });

    const newSession = {
      routine,
      workoutData: initialExercises,
      elapsedSeconds: 0,
      startTime: Date.now(),
    };

    setActiveSession(newSession);
    saveStoredActiveSession(newSession);
    setIsWorkoutModalOpen(true);
  };

  const handleUpdateWorkoutData = (newWorkoutData) => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, workoutData: newWorkoutData };
      saveStoredActiveSession(updated);
      return updated;
    });
  };

  const handleMinimizeWorkout = () => {
    setIsWorkoutModalOpen(false);
  };

  const handleFinishWorkout = (summary) => {
    const updatedHistory = saveWorkoutToHistory(summary);
    setHistory(updatedHistory);
    clearStoredActiveSession();
    setActiveSession(null);
    setIsWorkoutModalOpen(false);
    setCompletedSummary(summary);
  };

  const handleCancelWorkout = () => {
    if (
      window.confirm(
        'Tem certeza que deseja cancelar o treino atual? Todo o progresso desta sessão será descartado.'
      )
    ) {
      clearStoredActiveSession();
      setActiveSession(null);
      setIsWorkoutModalOpen(false);
    }
  };

  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  // Filtering exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesMuscle = selectedMuscle === 'todos' || ex.muscle === selectedMuscle;
    const matchesSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(exerciseSearch.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDataReload={loadAllData}
        onOpenNewExercise={() => {
          setExerciseToEdit(null);
          setIsExerciseModalOpen(true);
        }}
        onOpenNewRoutine={() => {
          setRoutineToEdit(null);
          setIsRoutineModalOpen(true);
        }}
      />

      {/* Persistent Active Workout Banner when minimized */}
      {activeSession && !isWorkoutModalOpen && (
        <ActiveWorkoutBanner
          session={activeSession}
          onResume={() => setIsWorkoutModalOpen(true)}
          onCancel={handleCancelWorkout}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ================= TAB 1: TREINAR ================= */}
        {activeTab === 'treinar' && (
          <div className="space-y-8 animate-fade-in">
            {/* Nike Run / Training Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#12131b] via-[#161824] to-[#12131b] border border-[#232635] p-6 sm:p-10 shadow-2xl">
              <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#ccff00]/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] text-xs font-black uppercase tracking-widest mb-4">
                  <IconSparkles className="w-3.5 h-3.5" />
                  Pronto para a sessão de hoje?
                </div>

                <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight leading-none mb-3">
                  CONSTRUA SUA <span className="text-[#ccff00]">MELHOR VERSÃO</span>
                </h1>

                <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6">
                  Selecione uma de suas fichas de treino abaixo, acompanhe suas séries e repetições em tempo real e registre sua evolução diária.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <div className="flex items-center gap-1.5 bg-[#181a26] px-3.5 py-2 rounded-xl border border-[#26293a]">
                    <IconFlame className="w-4 h-4 text-[#ccff00]" />
                    <span>{history.length} Treinos Registrados</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#181a26] px-3.5 py-2 rounded-xl border border-[#26293a]">
                    <IconDumbbell className="w-4 h-4 text-[#00f0ff]" />
                    <span>{exercises.length} Exercícios na Biblioteca</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Routines Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                    Fichas Prontas para Treinar
                  </h2>
                  <p className="text-xs text-gray-400">Clique em Iniciar Treino para ativar o cronômetro e registro de séries</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRoutineToEdit(null);
                    setIsRoutineModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1a1c29] hover:bg-[#252839] border border-[#2b2f42] text-xs font-black uppercase tracking-wider text-[#ccff00] flex items-center gap-1.5 transition"
                >
                  <IconPlus className="w-4 h-4 stroke-[3]" />
                  Nova Ficha
                </button>
              </div>

              {routines.length === 0 ? (
                <div className="border border-dashed border-[#242738] rounded-3xl p-10 text-center text-gray-400">
                  <p className="text-sm">Você ainda não tem nenhuma ficha cadastrada.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setRoutineToEdit(null);
                      setIsRoutineModalOpen(true);
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#ccff00] text-black font-bold text-xs uppercase"
                  >
                    Criar Minha Primeira Ficha
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {routines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      exercisesMap={exercisesMap}
                      onStartWorkout={handleStartWorkout}
                      onEdit={(r) => {
                        setRoutineToEdit(r);
                        setIsRoutineModalOpen(true);
                      }}
                      onDelete={handleDeleteRoutine}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MINHAS FICHAS ================= */}
        {activeTab === 'fichas' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Gerenciador de Fichas de Treino
                </h2>
                <p className="text-xs text-gray-400">
                  Crie e organize divisões de treino personalizadas (ex: ABC, ABCD, Full Body)
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRoutineToEdit(null);
                  setIsRoutineModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 transition"
              >
                <IconPlus className="w-4 h-4 stroke-[3]" />
                Criar Nova Ficha
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  exercisesMap={exercisesMap}
                  onStartWorkout={handleStartWorkout}
                  onEdit={(r) => {
                    setRoutineToEdit(r);
                    setIsRoutineModalOpen(true);
                  }}
                  onDelete={handleDeleteRoutine}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: EXERCÍCIOS ================= */}
        {activeTab === 'exercicios' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & New Exercise CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Biblioteca de Exercícios ({exercises.length})
                </h2>
                <p className="text-xs text-gray-400">
                  Adicione fotos, nome, número de repetições, carga e instruções técnicas personalizadas
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setExerciseToEdit(null);
                  setIsExerciseModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 transition self-start sm:self-auto"
              >
                <IconPlus className="w-4 h-4 stroke-[3]" />
                Adicionar Exercício
              </button>
            </div>

            {/* Search Bar & Muscle Filters */}
            <div className="space-y-3">
              <div className="relative">
                <IconSearch className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Buscar exercício por nome ou grupo muscular..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full bg-[#12131a] border border-[#232637] focus:border-[#ccff00] rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>

              {/* Muscle Group Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {MUSCLE_GROUPS.map((group) => {
                  const isSelected = selectedMuscle === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => setSelectedMuscle(group.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition border ${
                        isSelected
                          ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-md shadow-[#ccff00]/20'
                          : 'bg-[#14151e] text-gray-400 border-[#232637] hover:border-[#383d54] hover:text-white'
                      }`}
                    >
                      {group.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exercise Cards Grid */}
            {filteredExercises.length === 0 ? (
              <div className="border border-dashed border-[#242738] rounded-3xl p-12 text-center text-gray-400 bg-[#12131a]/50">
                <IconDumbbell className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                <h4 className="font-display font-bold text-white text-base">Nenhum exercício encontrado</h4>
                <p className="text-xs text-gray-400 mt-1">Tente buscar por outro termo ou adicione um novo exercício.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onEdit={(ex) => {
                      setExerciseToEdit(ex);
                      setIsExerciseModalOpen(true);
                    }}
                    onDelete={handleDeleteExercise}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: HISTÓRICO & STATS ================= */}
        {activeTab === 'historico' && (
          <div className="animate-fade-in">
            <HistoryTab history={history} onClearHistory={handleClearHistory} />
          </div>
        )}
      </main>

      {/* ================= MODALS & ACTIVE WORKOUT ================= */}
      {/* Exercise Create/Edit Modal */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => {
          setIsExerciseModalOpen(false);
          setExerciseToEdit(null);
        }}
        onSave={handleSaveExercise}
        exerciseToEdit={exerciseToEdit}
      />

      {/* Routine Create/Edit Modal */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => {
          setIsRoutineModalOpen(false);
          setRoutineToEdit(null);
        }}
        onSave={handleSaveRoutine}
        allExercises={exercises}
        routineToEdit={routineToEdit}
      />

      {/* Active Workout Screen (Nike/Hevy Style Session) */}
      {activeSession && isWorkoutModalOpen && (
        <ActiveWorkoutModal
          session={activeSession}
          onUpdateWorkoutData={handleUpdateWorkoutData}
          onMinimize={handleMinimizeWorkout}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
        />
      )}

      {/* Post-Workout Summary & Confetti */}
      {completedSummary && (
        <WorkoutSummaryModal
          summary={completedSummary}
          onClose={() => setCompletedSummary(null)}
        />
      )}
    </div>
  );
}
