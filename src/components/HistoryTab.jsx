import React, { useState } from 'react';
import { IconTrophy, IconClock, IconDumbbell, IconCalendar, IconFlame, IconTrash, IconChevronDown } from './Icons';

export default function HistoryTab({ history, onClearHistory }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Aggregated Stats
  const totalWorkouts = history.length;
  const totalVolume = history.reduce((acc, h) => acc + (Number(h.totalVolumeKg) || 0), 0);
  const totalSeconds = history.reduce((acc, h) => acc + (Number(h.durationSeconds) || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data indisponível';
    }
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Aggregated Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Workouts */}
        <div className="bg-[#12131a] border border-[#222533] p-4 sm:p-5 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/10 text-[#ccff00] flex items-center justify-center mb-3">
            <IconFlame className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] uppercase font-bold text-gray-400 block">Treinos Concluídos</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-white mt-0.5 block">
            {totalWorkouts}
          </span>
        </div>

        {/* Total Lifted Volume */}
        <div className="bg-[#12131a] border border-[#222533] p-4 sm:p-5 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mb-3">
            <IconDumbbell className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase font-bold text-gray-400 block">Volume Levantado</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-white mt-0.5 block">
            {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)} t` : `${totalVolume} kg`}
          </span>
        </div>

        {/* Total Time */}
        <div className="bg-[#12131a] border border-[#222533] p-4 sm:p-5 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <IconClock className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase font-bold text-gray-400 block">Tempo Total</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-white mt-0.5 block">
            {totalHours} h
          </span>
        </div>

        {/* Consistency Score */}
        <div className="bg-[#12131a] border border-[#222533] p-4 sm:p-5 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <IconTrophy className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase font-bold text-gray-400 block">Status de Atleta</span>
          <span className="font-display font-black text-xl sm:text-2xl text-[#ccff00] mt-0.5 block truncate">
            {totalWorkouts >= 10 ? 'Nível Elite' : totalWorkouts >= 5 ? 'Avançado' : 'Focado'}
          </span>
        </div>
      </div>

      {/* History Header & Action */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
          <IconCalendar className="w-5 h-5 text-[#ccff00]" />
          Histórico de Sessões
        </h3>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar todo o histórico de treinos?')) {
                onClearHistory();
              }
            }}
            className="text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
          >
            <IconTrash className="w-3.5 h-3.5" />
            Limpar Histórico
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="border border-dashed border-[#242738] rounded-3xl p-12 text-center text-gray-400 bg-[#12131a]/50">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#181a24] text-gray-500 flex items-center justify-center">
            <IconCalendar className="w-8 h-8 stroke-1" />
          </div>
          <h4 className="font-display font-bold text-white text-base">Nenhum treino registrado ainda</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Escolha uma ficha na aba <strong>Treinar</strong> e clique em <strong>Iniciar Treino</strong> para registrar sua primeira sessão.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((log) => {
            const isExpanded = expandedId === log.id;

            return (
              <div
                key={log.id}
                className="bg-[#12131a] border border-[#222533] hover:border-[#32364a] rounded-2xl p-4 sm:p-5 transition shadow-lg"
              >
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#191c28] border border-[#292c3d] flex items-center justify-center text-[#ccff00] shrink-0 font-bold">
                      <IconFlame className="w-6 h-6 stroke-2" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-white text-base">
                          {log.routineTitle}
                        </h4>
                        {log.routineTag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-md">
                            {log.routineTag}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {formatDate(log.date)}
                      </span>
                    </div>
                  </div>

                  {/* Quick stats on the right */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="bg-[#171924] px-3 py-1.5 rounded-xl border border-[#242738]">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Tempo</span>
                      <strong className="text-white font-mono">{formatDuration(log.durationSeconds)}</strong>
                    </div>

                    <div className="bg-[#171924] px-3 py-1.5 rounded-xl border border-[#242738]">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Volume</span>
                      <strong className="text-[#ccff00] font-mono">{log.totalVolumeKg.toLocaleString('pt-BR')} kg</strong>
                    </div>

                    <div className="bg-[#171924] px-3 py-1.5 rounded-xl border border-[#242738]">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Séries</span>
                      <strong className="text-white font-mono">{log.totalSetsCompleted}/{log.totalSets}</strong>
                    </div>
                  </div>
                </div>

                {/* Expanded Session Details */}
                {isExpanded && log.exercisesData && (
                  <div className="mt-4 pt-4 border-t border-[#1f2231] space-y-3 animate-fade-in">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      Detalhes dos Exercícios & Séries Executadas
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {log.exercisesData.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="bg-[#161824] p-3 rounded-xl border border-[#232637]"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {ex.imageUrl && (
                              <img src={ex.imageUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                            )}
                            <h5 className="text-xs font-bold text-white truncate">{ex.name}</h5>
                          </div>

                          <div className="space-y-1">
                            {ex.sets.map((set, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-[#0f1017] text-gray-300"
                              >
                                <span>Série {set.setNumber}</span>
                                <span className="font-mono text-white font-semibold">
                                  {set.weight} kg × {set.reps} reps
                                </span>
                                <span
                                  className={`text-[10px] font-bold ${
                                    set.completed ? 'text-emerald-400' : 'text-gray-500'
                                  }`}
                                >
                                  {set.completed ? '✓ Concluído' : 'Pulado'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
