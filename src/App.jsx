import React, { useState, useEffect, useRef } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Header from './components/Header';
import FloatingActions from './components/FloatingActions';
import CreateModal from './components/CreateModal';
import VoteModal from './components/VoteModal';
import LeaderboardModal from './components/LeaderboardModal';
import HelpModal from './components/HelpModal';
import {
  subscribeToKrathongs,
  addKrathongToFirestore,
  voteInFirestore,
  seedInitialContestantsIfEmpty
} from './services/firebase';
import { getContestants, addContestant, voteForContestant, getVotedIds, markAsVoted } from './data/storage';

export default function App() {
  const [allContestants, setAllContestants] = useState([]);
  const [riverKrathongs, setRiverKrathongs] = useState([]);
  const [selectedContestantId, setSelectedContestantId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [votedIds, setVotedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  const sceneRef = useRef(null);

  // คำนวณกระทงที่ลอยในแม่น้ำ:
  // "เมื่อมีเราเพิ่มข้อมูลในรายการ ในแม่น้ำจะต้องไม่มีกระทงใบอื่นๆ"
  // หากมีกระทงที่ผู้ใช้สร้าง จะแสดงเฉพาะกระทงของผู้ใช้ในแม่น้ำเท่านั้น (กระทงตัวอย่างใบอื่นๆ จะไม่อยู่ในแม่น้ำ)
  const getRiverDisplayList = (list) => {
    if (!Array.isArray(list)) return [];
    const userCreated = list.filter(c => c.isUserCreated);
    if (userCreated.length > 0) {
      return userCreated;
    }
    return list;
  };

  // Real-time Firestore synchronization on mount
  useEffect(() => {
    setVotedIds(getVotedIds());

    // 1. Initial fallback load from LocalStorage so scene is immediately ready
    const localList = getContestants();
    setAllContestants(localList);
    setRiverKrathongs(getRiverDisplayList(localList));

    // 2. Seed Firestore if empty & subscribe to Real-time updates
    seedInitialContestantsIfEmpty();

    const unsubscribe = subscribeToKrathongs(
      (firestoreList) => {
        setIsFirestoreConnected(true);
        setAllContestants(firestoreList);
        setRiverKrathongs(getRiverDisplayList(firestoreList));
      },
      (error) => {
        console.warn('[Firestore] Using local mode fallback:', error.message);
        setIsFirestoreConnected(false);
      }
    );

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // When a user selects a krathong in 3D scene (via tap/click)
  const handleSelectKrathong = (id) => {
    setSelectedContestantId(id);
  };

  // When user votes for a contestant
  const handleVote = async (id) => {
    markAsVoted(id);
    setVotedIds(prev => [...prev, id]);

    // Optimistic UI update
    setAllContestants(prev =>
      prev.map(c => (c.id === id ? { ...c, votes: (c.votes || 0) + 1 } : c))
    );
    setRiverKrathongs(prev =>
      prev.map(c => (c.id === id ? { ...c, votes: (c.votes || 0) + 1 } : c))
    );

    try {
      // 1. Update in Cloud Firestore atomically
      await voteInFirestore(id);
    } catch (e) {
      console.warn('[Firestore] Vote offline fallback to LocalStorage:', e);
      voteForContestant(id);
    }
  };

  // When user submits a new Krathong
  const handleCreateKrathong = async (formData) => {
    let newEntry;
    try {
      // 1. Save to Cloud Firestore with compressed photo (<= 500KB)
      newEntry = await addKrathongToFirestore(formData);
    } catch (e) {
      console.warn('[Firestore] Create offline fallback to LocalStorage:', e);
      newEntry = addContestant(formData);
    }

    setAllContestants(prev => {
      const updated = [newEntry, ...prev.filter(c => c.id !== newEntry.id)];
      // เมื่อเพิ่มข้อมูลในรายการ ในแม่น้ำจะมีเฉพาะกระทงที่สร้างจริง (ไม่มีกระทงตัวอย่างใบอื่นๆ)
      setRiverKrathongs(getRiverDisplayList(updated));
      return updated;
    });

    // โฟกัสกล้องไปที่กระทงที่เพิ่งปล่อยลงน้ำ
    setTimeout(() => {
      if (sceneRef.current) {
        sceneRef.current.focusOnKrathong(newEntry.id);
      }
    }, 200);
  };

  // Focus camera on a specific krathong
  const handleFocusKrathong = (id) => {
    if (sceneRef.current) {
      sceneRef.current.focusOnKrathong(id);
    }
  };

  const activeContestant =
    riverKrathongs.find(c => c.id === selectedContestantId) ||
    allContestants.find(c => c.id === selectedContestantId);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-night-950">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-night-950 transition-opacity duration-700">
          <div className="text-6xl animate-bounce mb-3">🪷</div>
          <h2 className="text-2xl font-bold gold-gradient-text tracking-wide mb-1">
            งานลอยกระทงออนไลน์ 3D
          </h2>
          <p className="text-sm text-slate-400">
            กำลังเชื่อมต่อ Cloud Firestore และจำลองบรรยากาศงานริมสายน้ำ...
          </p>
          <div className="w-56 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-yellow-300 animate-pulse" />
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Layer - Always mounted so scene never goes black */}
      <ThreeCanvas
        contestants={riverKrathongs}
        onSelectKrathong={handleSelectKrathong}
        sceneRef={sceneRef}
      />

      {/* Header Bar */}
      <Header
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        krathongCount={riverKrathongs.length}
      />

      {/* Cloud Firestore Status Badge (top right sub) */}
      <div className="absolute top-18 right-4 sm:right-6 z-10 glass-panel px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border border-white/10 shadow-md">
        <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        <span className="text-slate-300">
          {isFirestoreConnected ? '🔥 Cloud Firestore: เชื่อมต่อสำเร็จ' : '⚡ กำลังซิงค์ข้อมูล Cloud Firestore'}
        </span>
      </div>

      {/* Bottom Floating Action Bar & Stats */}
      <FloatingActions
        onOpenCreate={() => setIsCreateOpen(true)}
        krathongCount={riverKrathongs.length}
      />

      {/* Create Krathong & Selfie Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateKrathong}
      />

      {/* Vote & Contestant Details Modal */}
      <VoteModal
        contestant={activeContestant}
        isOpen={!!selectedContestantId}
        onClose={() => setSelectedContestantId(null)}
        onVote={handleVote}
        onFocusKrathong={handleFocusKrathong}
        hasVoted={votedIds.includes(selectedContestantId)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        contestants={allContestants}
        onSelectContestant={(id) => {
          setSelectedContestantId(id);
          handleFocusKrathong(id);
        }}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </main>
  );
}
