import { DEFAULT_EXERCISES, DEFAULT_ROUTINES } from '../data/defaultData';

const KEYS = {
  EXERCISES: 'pulse_fit_exercises_v2',
  ROUTINES: 'pulse_fit_routines_v2',
  HISTORY: 'pulse_fit_history_v1',
  ACTIVE_SESSION: 'pulse_fit_active_session_v2',
  STATS: 'pulse_fit_stats_v1',
};

// Safe JSON parser
function safeParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

// Safe JSON writer
function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Exercises
export function getStoredExercises() {
  const stored = safeParse(KEYS.EXERCISES, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    safeSave(KEYS.EXERCISES, DEFAULT_EXERCISES);
    return DEFAULT_EXERCISES;
  }
  return stored;
}

export function saveStoredExercises(exercises) {
  safeSave(KEYS.EXERCISES, exercises);
}

// Routines
export function getStoredRoutines() {
  const stored = safeParse(KEYS.ROUTINES, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    safeSave(KEYS.ROUTINES, DEFAULT_ROUTINES);
    return DEFAULT_ROUTINES;
  }
  return stored;
}

export function saveStoredRoutines(routines) {
  safeSave(KEYS.ROUTINES, routines);
}

// Workout History
export function getStoredHistory() {
  return safeParse(KEYS.HISTORY, []);
}

export function saveWorkoutToHistory(workout) {
  const history = getStoredHistory();
  const updated = [workout, ...history];
  safeSave(KEYS.HISTORY, updated);
  return updated;
}

export function clearStoredHistory() {
  safeSave(KEYS.HISTORY, []);
}

// Active Live Workout session (in case of accidental browser refresh)
export function getStoredActiveSession() {
  return safeParse(KEYS.ACTIVE_SESSION, null);
}

export function saveStoredActiveSession(session) {
  if (!session) {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  } else {
    safeSave(KEYS.ACTIVE_SESSION, session);
  }
}

export function clearStoredActiveSession() {
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
}

// Export data to JSON string for backup
export function exportDataAsJSON() {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    exercises: getStoredExercises(),
    routines: getStoredRoutines(),
    history: getStoredHistory(),
  };
  return JSON.stringify(data, null, 2);
}

// Import data from JSON string
export function importDataFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.exercises && Array.isArray(data.exercises)) {
      saveStoredExercises(data.exercises);
    }
    if (data.routines && Array.isArray(data.routines)) {
      saveStoredRoutines(data.routines);
    }
    if (data.history && Array.isArray(data.history)) {
      safeSave(KEYS.HISTORY, data.history);
    }
    return true;
  } catch (e) {
    console.error('Failed to import JSON data:', e);
    return false;
  }
}

// Factory reset to default workouts
export function resetAppToDefaults() {
  safeSave(KEYS.EXERCISES, DEFAULT_EXERCISES);
  safeSave(KEYS.ROUTINES, DEFAULT_ROUTINES);
  safeSave(KEYS.HISTORY, []);
  clearStoredActiveSession();
}
