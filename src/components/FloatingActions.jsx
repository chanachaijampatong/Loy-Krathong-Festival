import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FloatingActions({ onOpenCreate, krathongCount }) {
  return (
    <>
      {/* Bottom Floating Action Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-slate-950 font-bold text-sm sm:text-base border border-yellow-200 shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all animate-float-breath"
        >
          <Sparkles className="w-5 h-5 text-amber-950" />
          <span>สร้างกระทง & ส่งเข้าประกวด</span>
        </button>
      </div>

      {/* Info Badge Top-Left under Header */}
      <div className="absolute top-18 left-4 sm:left-6 z-10 glass-panel px-3.5 py-1.5 rounded-xl text-xs sm:text-sm text-slate-300 flex items-center gap-2.5 shadow-md border border-white/10">
        <span>🪷 กระทงในแม่น้ำ: <strong className="text-amber-400 font-semibold">{krathongCount}</strong> กระทง</span>
        <span className="text-slate-500">•</span>
        <span>👥 ผู้ร่วมงาน: <strong className="text-amber-400 font-semibold">20</strong> คน</span>
      </div>

      {/* Camera Guidance Hint */}
      <div className="hidden sm:flex absolute bottom-22 left-1/2 -translate-x-1/2 z-10 glass-panel px-4 py-1.5 rounded-full text-xs text-slate-300 items-center gap-2 shadow-lg border border-white/5">
        <span>💡 เลื่อน/หมุนเพื่อชมวิว 360° | ซูมเข้า-ออก | แตะที่กระทงในแม่น้ำเพื่อเปิดดูและโหวตคะแนน</span>
      </div>
    </>
  );
}
