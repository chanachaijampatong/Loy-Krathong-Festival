import React, { useState } from 'react';
import { Heart, X, Search, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export default function VoteModal({
  contestant,
  isOpen,
  onClose,
  onVote,
  onFocusKrathong,
  hasVoted
}) {
  const [justVoted, setJustVoted] = useState(false);

  if (!isOpen || !contestant) return null;

  const handleVoteClick = () => {
    if (justVoted) return;

    soundManager.playChime();
    setJustVoted(true);

    // Trigger colorful confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#06b6d4', '#10b981', '#fef08a']
      });
    } catch (e) {}

    onVote(contestant.id);

    setTimeout(() => {
      setJustVoted(false);
    }, 2500);
  };

  const getStyleName = (style) => {
    switch (style) {
      case 'pink-lotus': return 'กระทงบัวหลวงชมพู';
      case 'golden-royal': return 'กระทงทองคำอร่าม';
      case 'cyan-celestial': return 'กระทงกลีบผกาฟ้าคราม';
      case 'rainbow-festival': return 'กระทงหลากสีแฟนซี';
      case 'classic-banana':
      default: return 'กระทงใบตองดั้งเดิม';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl glass-panel-gold border border-amber-500/40 shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contestant Avatar & Krathong Style Badge */}
        <div className="relative mt-2">
          <img
            src={contestant.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Contestant'}
            alt={contestant.name}
            className="w-24 h-24 sm:w-26 sm:h-26 rounded-full object-cover border-3 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] bg-slate-900"
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-slate-900/90 border border-amber-400 text-amber-300 text-[11px] font-semibold shadow-md">
            {getStyleName(contestant.style)}
          </span>
        </div>

        {/* Contestant Name */}
        <div className="mt-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-100">
            {contestant.name}
          </h3>
          <p className="text-xs text-slate-400">
            ผู้ส่งเข้าประกวดกระทงออนไลน์
          </p>
        </div>

        {/* Wish Container */}
        <div className="relative w-full p-4 rounded-xl bg-night-950/70 border border-white/10 text-left">
          <span className="absolute top-1 left-2.5 text-2xl text-amber-500/30 font-serif">“</span>
          <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-3">
            {contestant.wish}
          </p>
        </div>

        {/* Vote Counter Display */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-heart-beat" />
            <span className="text-2xl font-bold text-amber-400">
              {contestant.votes || 0}
            </span>
            <span className="text-xs text-slate-300">คะแนนโหวต</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {hasVoted ? 'คุณได้ร่วมส่งกำลังใจให้ผู้เข้าประกวดนี้แล้ว' : 'แตะปุ่มด้านล่างเพื่อโหวตคะแนน'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-2">
          <button
            onClick={handleVoteClick}
            className={`w-full py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              justVoted
                ? 'bg-emerald-600 text-white shadow-emerald-600/40'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/40 hover:scale-[1.02]'
            }`}
          >
            {justVoted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>โหวตสำเร็จแล้ว! ขอบคุณครับ</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                <span>โหวตให้คะแนนกระทงนี้</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onFocusKrathong(contestant.id);
              onClose();
            }}
            className="w-full py-2 rounded-xl glass-panel hover:bg-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>ซูมส่องกระทงนี้ในแม่น้ำ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
