import React, { useRef } from 'react';
import { IconFlame, IconDumbbell, IconCalendar, IconUpload, IconDownload, IconRotateCcw, IconPlus } from './Icons';
import { exportDataAsJSON, importDataFromJSON, resetAppToDefaults } from '../utils/storage';

export default function Navbar({ activeTab, setActiveTab, onDataReload, onOpenNewExercise, onOpenNewRoutine }) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulse-fit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importDataFromJSON(event.target.result);
      if (success) {
        alert('Dados importados com sucesso!');
        onDataReload();
      } else {
        alert('Erro ao importar arquivo. Verifique o formato JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as fichas e exercícios originais de fábrica? Isso não afeta seu navegador.')) {
      resetAppToDefaults();
      onDataReload();
    }
  };

  const tabs = [
    { id: 'treinar', label: 'Treinar', icon: IconFlame },
    { id: 'fichas', label: 'Minhas Fichas', icon: IconDumbbell },
    { id: 'exercicios', label: 'Exercícios', icon: IconDumbbell },
    { id: 'historico', label: 'Histórico & Stats', icon: IconCalendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#1c1e2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Nike Run / Training Inspired */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center font-black shadow-lg shadow-[#ccff00]/20 transform -rotate-3 hover:rotate-0 transition">
              <IconFlame className="w-7 h-7 stroke-[2.6]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl tracking-tighter text-white">
                  PULSE
                </span>
                <span className="font-display font-black text-2xl tracking-tight text-[#ccff00]">
                  FIT
                </span>
              </div>
              <span className="text-[10px] tracking-widest font-black uppercase text-gray-500 block -mt-1">
                TREINO & MUSCULAÇÃO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#12131b] p-1.5 rounded-2xl border border-[#212433]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1c27]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Backup / New Item */}
          <div className="flex items-center gap-2">
            {/* Quick Action Button depending on tab */}
            {activeTab === 'exercicios' && (
              <button
                type="button"
                onClick={onOpenNewExercise}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider shadow-md shadow-[#ccff00]/20 transition"
              >
                <IconPlus className="w-4 h-4 stroke-[3]" />
                Novo Exercício
              </button>
            )}

            {activeTab === 'fichas' && (
              <button
                type="button"
                onClick={onOpenNewRoutine}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider shadow-md shadow-[#ccff00]/20 transition"
              >
                <IconPlus className="w-4 h-4 stroke-[3]" />
                Nova Ficha
              </button>
            )}

            {/* Storage Tools Menu */}
            <div className="flex items-center gap-1 bg-[#12131b] p-1 rounded-xl border border-[#212433]">
              <button
                type="button"
                onClick={handleExport}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c1e2a] transition"
                title="Fazer Backup (Exportar JSON)"
              >
                <IconDownload className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c1e2a] transition"
                title="Restaurar Backup (Importar JSON)"
              >
                <IconUpload className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-amber-400 rounded-lg hover:bg-[#1c1e2a] transition"
                title="Restaurar Padrões Iniciais"
              >
                <IconRotateCcw className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#1c1e2a]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${
                  isActive ? 'text-[#ccff00]' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 stroke-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
