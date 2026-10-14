import React, { useState, useEffect } from 'react';
import { MUSCLE_GROUPS } from '../data/defaultData';
import { IconX, IconUpload, IconImage, IconDumbbell, IconCheck } from './Icons';

export default function ExerciseModal({ isOpen, onClose, onSave, exerciseToEdit = null }) {
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('peito');
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState('10 - 12');
  const [weight, setWeight] = useState(20);
  const [restSeconds, setRestSeconds] = useState(60);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('upload'); // 'upload' | 'url'
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name || '');
      setMuscle(exerciseToEdit.muscle || 'peito');
      setSets(exerciseToEdit.sets || 4);
      setReps(exerciseToEdit.reps || '10 - 12');
      setWeight(exerciseToEdit.weight ?? 20);
      setRestSeconds(exerciseToEdit.restSeconds || 60);
      setNotes(exerciseToEdit.notes || '');
      setImageUrl(exerciseToEdit.imageUrl || '');
      setImageType(exerciseToEdit.imageUrl && exerciseToEdit.imageUrl.startsWith('http') ? 'url' : 'upload');
    } else {
      setName('');
      setMuscle('peito');
      setSets(4);
      setReps('10 - 12');
      setWeight(20);
      setRestSeconds(60);
      setNotes('');
      setImageUrl('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80');
      setImageType('upload');
    }
  }, [exerciseToEdit, isOpen]);

  if (!isOpen) return null;

  // Compress and convert uploaded image file to lightweight Base64 to safely fit in LocalStorage
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 600px width/height to keep LocalStorage ultra light
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.75 JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setImageUrl(compressedBase64);
        setIsProcessingImage(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const exerciseData = {
      id: exerciseToEdit ? exerciseToEdit.id : `ex-custom-${Date.now()}`,
      name: name.trim(),
      muscle,
      sets: Number(sets) || 3,
      reps: String(reps).trim() || '10 - 12',
      weight: Number(weight) || 0,
      restSeconds: Number(restSeconds) || 60,
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    };

    onSave(exerciseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#12131a] border border-[#26293a] rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222536]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <IconDumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-white">
                {exerciseToEdit ? 'Editar Exercício' : 'Novo Exercício'}
              </h2>
              <p className="text-xs text-gray-400">Personalize fotos, repetições, carga e detalhes técnicos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1f2231] transition"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Photo Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Foto do Exercício
            </label>

            {/* Photo Preview & Upload Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Preview Thumbnail */}
              <div className="relative h-40 rounded-2xl overflow-hidden border border-[#282b3d] bg-[#0c0d13] flex items-center justify-center group">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3 text-gray-500">
                    <IconImage className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[11px]">Nenhuma foto selecionada</span>
                  </div>
                )}
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-[#ccff00]">
                    Otimizando imagem...
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageType('upload')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      imageType === 'upload'
                        ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                        : 'bg-[#1b1d28] text-gray-400 hover:text-white'
                    }`}
                  >
                    <IconUpload className="w-3.5 h-3.5" />
                    Enviar do Aparelho
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageType('url')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      imageType === 'url'
                        ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                        : 'bg-[#1b1d28] text-gray-400 hover:text-white'
                    }`}
                  >
                    <IconImage className="w-3.5 h-3.5" />
                    Link URL da Web
                  </button>
                </div>

                {imageType === 'upload' ? (
                  <div>
                    <label className="cursor-pointer block border-2 border-dashed border-[#2f3347] hover:border-[#ccff00] rounded-xl p-3 text-center bg-[#151722] hover:bg-[#1a1d2b] transition">
                      <span className="text-xs font-medium text-gray-300 block">
                        Clique aqui para carregar uma foto da sua galeria
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5 block">
                        PNG, JPG, WEBP (será otimizada automaticamente para o armazenamento local)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto-do-exercicio.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exercise Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Nome do Exercício <span className="text-[#ccff00]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Supino Reto com Barra, Agachamento Búlgaro..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
            />
          </div>

          {/* Muscle Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Grupo Muscular Principal
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {MUSCLE_GROUPS.filter((m) => m.id !== 'todos').map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMuscle(m.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider border transition text-center ${
                    muscle === m.id
                      ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-md shadow-[#ccff00]/20'
                      : 'bg-[#151722] text-gray-400 border-[#262939] hover:border-[#383d54] hover:text-white'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sets, Reps, Weight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Séries
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-3 py-2 text-sm text-white outline-none transition"
              />
            </div>

            {/* Repetitions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Repetições <span className="text-[#ccff00]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: 8 - 12 ou 10"
                required
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>

            {/* Target Weight */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Carga / Peso (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-3 py-2 text-sm text-white outline-none transition"
              />
            </div>
          </div>

          {/* Rest Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Tempo de Descanso entre Séries
            </label>
            <div className="flex items-center gap-2">
              {[30, 45, 60, 90, 120].map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setRestSeconds(sec)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                    restSeconds === sec
                      ? 'bg-[#232738] text-[#ccff00] border-[#ccff00]'
                      : 'bg-[#151722] text-gray-400 border-[#262939] hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Technical Notes / Posture Tips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Dicas de Postura e Observações (Opcional)
            </label>
            <textarea
              rows="2"
              placeholder="Ex: Manter cotovelos alinhados, descer com controle, inspirar na descida..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#161824] border border-[#282b3d] focus:border-[#ccff00] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 transition transform active:scale-95"
            >
              <IconCheck className="w-4 h-4" />
              {exerciseToEdit ? 'Atualizar Exercício' : 'Salvar Exercício'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
