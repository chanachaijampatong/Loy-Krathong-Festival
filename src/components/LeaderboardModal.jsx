import React from 'react';
import { Trophy, X, Heart, Eye } from 'lucide-react';

export default function LeaderboardModal({
  isOpen,
  onClose,
  contestants,
  onSelectContestant
}) {
  if (!isOpen) return null;

  // Sort descending by votes
  const sorted = [...contestants].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md">🥇 1</span>;
    if (rank === 2) return <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md">🥈 2</span>;
    if (rank === 3) return <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shadow-md">🥉 3</span>;
    return <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-semibold flex items-center justify-center text-xs">{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[85vh] rounded-2xl glass-panel-gold border border-amber-500/40 shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-400">
                ตารางอันดับคะแนนโหวต (Leaderboard)
              </h3>
              <p className="text-xs text-slate-400">
                กระทงยอดนิยมขวัญใจมหาชนในงานลอยกระทง 3D
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contestants List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {sorted.map((item, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectContestant(item.id);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-night-950/60 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(rank)}
                  <img
                    src={item.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=User'}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/50 bg-slate-900"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                      {item.wish}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm font-bold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{item.votes || 0}</span>
                  </div>
                  <Eye className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
