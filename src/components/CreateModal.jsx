import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';

const KRATHONG_STYLES = [
  { id: 'classic-banana', name: 'กระทงใบตองดั้งเดิม', emoji: '🍃', tag: 'มรกตสิริมงคล', desc: 'ใบตองพับวิจิตร ดอกดาวเรือง' },
  { id: 'pink-lotus', name: 'กระทงบัวหลวงชมพู', emoji: '🪷', tag: 'ความรักผูกพัน', desc: 'กลีบบัวบานสะพรั่ง อ่อนหวาน' },
  { id: 'golden-royal', name: 'กระทงทองคำอร่าม', emoji: '👑', tag: 'โชคลาภบารมี', desc: 'สีทองประกาย มั่งคั่งร่ำรวย' },
  { id: 'cyan-celestial', name: 'กระทงกลีบผกาฟ้าคราม', emoji: '💎', tag: 'สุขสงบร่มเย็น', desc: 'สีฟ้าครามดั่งสายธารา' },
  { id: 'rainbow-festival', name: 'กระทงหลากสีแฟนซี', emoji: '🌈', tag: 'สดใสรื่นเริง', desc: 'สีสันสดใส ร่วมสมัย' },
];

export default function CreateModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('classic-banana');
  const [avatarPreview, setAvatarPreview] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=MyKrathong&hair=long01');
  const [imageSizeKb, setImageSizeKb] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง หรือเลือกอัปโหลดรูปภาพแทนครับ');
      console.warn(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Process and compress image to <= 500KB
  const processAndSetImage = async (rawSource) => {
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(rawSource, 500 * 1024);
      setAvatarPreview(compressedDataUrl);

      // Calculate KB
      const head = 'data:image/jpeg;base64,';
      const str = compressedDataUrl.startsWith(head) ? compressedDataUrl.slice(head.length) : compressedDataUrl;
      const bytes = Math.round((str.length * 3) / 4);
      setImageSizeKb((bytes / 1024).toFixed(1));
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    const video = videoRef.current;
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - minDim) / 2;
    const startY = (video.videoHeight - minDim) / 2;

    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 480, 480);
    const rawData = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    processAndSetImage(rawData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) {
      alert('กรุณากรอกชื่อและคำอธิษฐานให้ครบถ้วนครับ');
      return;
    }

    soundManager.playChime();

    onSubmit({
      name: name.trim(),
      wish: wish.trim(),
      avatar: avatarPreview,
      style: selectedStyle
    });

    setName('');
    setWish('');
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl glass-panel-gold border border-amber-500/40 shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌸</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-400">
                สร้างกระทง & ส่งเข้าประกวด (Firestore)
              </h3>
              <p className="text-xs text-slate-400">
                ถ่ายรูปตนเอง บีบอัดรูป &lt; 500KB แล้วบันทึกลง Cloud Firestore
              </p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-2.5 p-3.5 rounded-xl bg-night-950/60 border border-amber-500/20">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              รูปถ่ายผู้เข้าประกวด (เซลฟี่หรืออัปโหลด):
            </label>

            {/* Video or Image Preview */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center bg-slate-900">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              )}

              {isCompressing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-amber-300 font-semibold animate-pulse">
                  กำลังบีบอัด...
                </div>
              )}
            </div>

            {/* Compression Status Badge (<= 500KB verification) */}
            {imageSizeKb && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ขนาดรูป: <strong>{imageSizeKb} KB</strong> / ไม่เกิน 500 KB (พร้อมบันทึก)</span>
              </div>
            )}

            {/* Camera / Upload Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={snapPhoto}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold shadow-md animate-pulse"
                >
                  🔴 กดถ่ายรูป
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm border border-white/10 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>เปิดกล้องถ่ายสด</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm border border-white/10 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>เลือกรูปจากเครื่อง</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              * ระบบมีฟังก์ชันบีบอัดรูปภาพอัตโนมัติให้ขนาดไม่เกิน 500KB ก่อนส่งเข้า Firestore
            </p>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              ชื่อ-นามสกุล / ชื่อเล่นผู้ประกวด: <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น น้องกานต์ หรือ มะลิ ใจดี"
              maxLength={50}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-night-950/80 border border-white/15 focus:border-amber-400 focus:outline-none text-slate-100 text-sm"
            />
          </div>

          {/* Wish Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              คำอธิษฐานวันลอยกระทง: <span className="text-red-400">*</span>
            </label>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="ขอขมาพระแม่คงคา ขอให้ครอบครัวมีความสุข สุขภาพแข็งแรง ไหลลื่นทุกการงาน..."
              rows={3}
              maxLength={250}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-night-950/80 border border-white/15 focus:border-amber-400 focus:outline-none text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Krathong Style Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              เลือกรูปแบบกระทงมงคล 3D:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {KRATHONG_STYLES.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative p-2.5 rounded-xl border text-left flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-night-950/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{style.emoji}</span>
                    <span className="text-xs font-bold text-slate-100 text-center leading-tight">
                      {style.name}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium">
                      {style.tag}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => { stopCamera(); onClose(); }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isCompressing}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>บันทึก & ปล่อยกระทงลงแม่น้ำ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
