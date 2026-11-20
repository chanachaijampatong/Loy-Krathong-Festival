import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { INITIAL_CONTESTANTS } from '../data/initialContestants';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App & Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION_NAME = 'krathongs';

/**
 * Seed initial 20 contestants to Firestore if collection is empty
 */
export async function seedInitialContestantsIfEmpty() {
  try {
    const krathongsCol = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(krathongsCol);

    if (snapshot.empty) {
      console.log('[Firestore] Seeding initial 20 contestants to Firestore...');
      for (const contestant of INITIAL_CONTESTANTS) {
        const docRef = doc(db, COLLECTION_NAME, contestant.id);
        await setDoc(docRef, {
          ...contestant,
          createdAt: contestant.createdAt || new Date().toISOString()
        });
      }
      console.log('[Firestore] Seeding completed successfully!');
    }
  } catch (error) {
    console.warn('[Firestore] Seed check notice:', error);
  }
}

/**
 * Subscribe to real-time updates from Firestore
 * Whenever any user floats a krathong or votes, this fires immediately on all connected clients
 */
export function subscribeToKrathongs(onUpdate, onError) {
  const krathongsCol = collection(db, COLLECTION_NAME);
  const q = query(krathongsCol);

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_CONTESTANTS);
        return;
      }

      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort by creation time (newest first)
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      onUpdate(list);
    },
    (err) => {
      console.error('[Firestore] Realtime subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save a newly created krathong with compressed photo into Firestore
 */
export async function addKrathongToFirestore(data) {
  const newId = `krathong-${Date.now()}`;
  const newContestant = {
    id: newId,
    name: data.name,
    wish: data.wish,
    avatar: data.avatar, // Compressed <= 500KB Base64
    style: data.style || 'classic-banana',
    votes: 1, // initial vote
    createdAt: new Date().toISOString(),
    initialPos: {
      x: (Math.random() - 0.5) * 6, // Spawn right near the pier center
      z: -3 - Math.random() * 3
    },
    isUserCreated: true
  };

  const docRef = doc(db, COLLECTION_NAME, newId);
  await setDoc(docRef, newContestant);
  return newContestant;
}

/**
 * Atomically increment vote in Firestore
 */
export async function voteInFirestore(krathongId) {
  const docRef = doc(db, COLLECTION_NAME, krathongId);
  await updateDoc(docRef, {
    votes: increment(1)
  });
}
