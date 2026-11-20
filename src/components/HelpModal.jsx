import React from 'react';
import { HelpCircle, X, RotateCw, ZoomIn, Hand, Sparkles } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl glass-panel-gold border border-amber-500/40 shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-400">
                วิธีใช้งานและสัมผัสบรรยากาศ 3D
              </h3>
              <p className="text-xs text-slate-400">
                ควบคุมฉากสามมิติและร่วมกิจกรรมประกวดกระทง
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

        {/* Guidance Items */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-night-950/60 border border-white/5">
            <RotateCw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100 mb-0.5">การหมุนมุมกล้อง (Rotate 360°)</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                <b>PC:</b> คลิกซ้ายค้างแล้วลากเมาส์<br />
                <b>สมาร์ทโฟน/แท็บเล็ต:</b> ใช้นิ้วเดียวแตะแล้วลากเพื่อชมวิวรอบงาน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-night-950/60 border border-white/5">
            <ZoomIn className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100 mb-0.5">การซูมเข้าและซูมออก (Zoom In/Out)</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                <b>PC:</b> หมุนลูกกลิ้งเมาส์ (Scroll Wheel)<br />
                <b>สมาร์ทโฟน/แท็บเล็ต:</b> ใช้สองนิ้วถ่างหรือบีบ (Pinch) เพื่อซูม
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-night-950/60 border border-white/5">
            <Hand className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100 mb-0.5">การแตะดูกระทงและกดโหวต (Vote)</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                แตะหรือคลิกที่กระทงใดก็ได้ที่ลอยอยู่ในแม่น้ำ จะมีหน้าต่างแสดงรูปถ่าย คำอธิษฐาน และปุ่มกดโหวตคะแนน
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-night-950/60 border border-white/5">
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100 mb-0.5">การส่งกระทงของตัวเอง</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                กดปุ่ม <b>"สร้างกระทง & ส่งเข้าประกวด"</b> ด้านล่าง เพื่อถ่ายภาพเซลฟี่ ป้อนชื่อ คำอธิษฐาน และเลือกดีไซน์กระทงมงคล
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:brightness-110 transition-all mt-1"
        >
          เข้าใจแล้ว เริ่มสนุกกันเลย!
        </button>
      </div>
    </div>
  );
}
