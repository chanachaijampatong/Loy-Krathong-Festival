import React from 'react';
import { Trophy, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Header({
  soundEnabled,
  setSoundEnabled,
  onOpenLeaderboard,
  onOpenHelp,
  krathongCount
}) {
  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 py-3.5 bg-gradient-to-b from-night-950/90 via-night-950/40 to-transparent pointer-events-none">
      {/* Title & Logo */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse-glow">
          🪷
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wide gold-gradient-text drop-shadow-md">
            ประเพณีลอยกระทง ๒๕๖๗
          </h1>
          <p className="text-xs text-slate-300 font-normal">
            ประกวดกระทง & โหวตขวัญใจมหาชน 3D
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full glass-panel hover:bg-slate-800/80 hover:border-amber-500/50 text-slate-100 text-xs sm:text-sm font-medium transition-all shadow-lg active:scale-95"
          title="อันดับคะแนนโหวต"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">อันดับคะแนน</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={handleToggleSound}
          className="p-2 sm:p-2.5 rounded-full glass-panel hover:bg-slate-800/80 hover:border-amber-500/50 text-slate-100 transition-all shadow-lg active:scale-95"
          title={soundEnabled ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงบรรยากาศ'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 sm:p-2.5 rounded-full glass-panel hover:bg-slate-800/80 hover:border-amber-500/50 text-slate-100 transition-all shadow-lg active:scale-95"
          title="วิธีใช้งาน"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
}
