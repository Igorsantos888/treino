import React, { useEffect, useState } from 'react';
import { IconClock, IconPlay, IconPause, IconX, IconPlus } from './Icons';
import { sound } from '../utils/audio';

export default function RestTimer({ initialSeconds = 60, onClose }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [totalTime, setTotalTime] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setTotalTime(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sound.playTimerDone();
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          if (prev === 4 || prev === 3 || prev === 2) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const addTime = (secs) => {
    setTimeLeft((prev) => Math.max(5, prev + secs));
    setTotalTime((prev) => Math.max(prev, timeLeft + secs));
  };

  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="bg-[#151720]/95 backdrop-blur-md border border-[#2a2d3d] p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-white min-w-[280px]">
        {/* Circular Progress Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="#262938"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke={timeLeft === 0 ? '#10b981' : '#ccff00'}
              strokeWidth="4"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 - (150.8 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>
          <span className="absolute text-xs font-black tracking-wider font-display">
            {timeLeft === 0 ? 'FIM' : formatted}
          </span>
        </div>

        {/* Content & Actions */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
              <IconClock className="w-3.5 h-3.5 text-[#ccff00]" />
              Descanso
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#232635] transition"
              title="Fechar Timer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-2.5 py-1 bg-[#232635] hover:bg-[#2e3245] rounded-lg text-xs font-medium text-gray-200 flex items-center gap-1 transition"
            >
              {isActive ? <IconPause className="w-3 h-3 text-[#ccff00]" /> : <IconPlay className="w-3 h-3 text-[#ccff00]" />}
              {isActive ? 'Pausar' : 'Continuar'}
            </button>
            <button
              onClick={() => addTime(15)}
              className="px-2 py-1 bg-[#232635] hover:bg-[#2e3245] rounded-lg text-xs font-semibold text-[#ccff00] transition"
            >
              +15s
            </button>
            <button
              onClick={() => addTime(-15)}
              disabled={timeLeft <= 15}
              className="px-2 py-1 bg-[#232635] hover:bg-[#2e3245] disabled:opacity-40 rounded-lg text-xs font-medium text-gray-400 transition"
            >
              -15s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
