import { INITIAL_CONTESTANTS } from './initialContestants.js';

const STORAGE_KEY = 'loy_krathong_contestants_v1';
const VOTED_KEY = 'loy_krathong_voted_ids_v1';

export function getContestants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load contestants from storage", e);
  }
  // Initialize with the 20 pre-configured contestants
  saveContestants(INITIAL_CONTESTANTS);
  return INITIAL_CONTESTANTS;
}

export function saveContestants(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save contestants to storage", e);
  }
}

export function addContestant(data) {
  const list = getContestants();
  const newContestant = {
    id: `krathong-custom-${Date.now()}`,
    name: data.name,
    wish: data.wish,
    avatar: data.avatar,
    style: data.style || 'classic-banana',
    votes: 1, // initial vote
    createdAt: new Date().toISOString(),
    initialPos: {
      x: (Math.random() - 0.5) * 6, // Spawn right near the pier center
      z: -3 - Math.random() * 3
    },
    isUserCreated: true
  };

  list.unshift(newContestant);
  saveContestants(list);
  return newContestant;
}

export function voteForContestant(id) {
  const list = getContestants();
  let updatedItem = null;
  const updatedList = list.map(item => {
    if (item.id === id) {
      updatedItem = { ...item, votes: (item.votes || 0) + 1 };
      return updatedItem;
    }
    return item;
  });

  saveContestants(updatedList);
  markAsVoted(id);
  return updatedItem;
}

export function getVotedIds() {
  try {
    const saved = localStorage.getItem(VOTED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function markAsVoted(id) {
  try {
    const ids = getVotedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(VOTED_KEY, JSON.stringify(ids));
    }
  } catch (e) {}
}
