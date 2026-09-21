import { SCHEMA_VERSION } from '../data/constants.js';
import { seedAppData } from '../data/seedData.js';

const STORAGE_KEY = 'ai-lexicon:appData';

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isValidCard(card) {
  return (
    isPlainObject(card) &&
    typeof card.id === 'string' &&
    typeof card.sectionId === 'string' &&
    typeof card.title === 'string' &&
    Array.isArray(card.tags)
  );
}

function isValidSection(section) {
  return (
    isPlainObject(section) &&
    typeof section.id === 'string' &&
    typeof section.title === 'string' &&
    Array.isArray(section.cards) &&
    section.cards.every(isValidCard)
  );
}

function isValidAppData(data) {
  return (
    isPlainObject(data) &&
    typeof data.schemaVersion === 'number' &&
    typeof data.appVersion === 'string' &&
    Array.isArray(data.sections) &&
    data.sections.every(isValidSection)
  );
}

function migrateAppData(data) {
  // No migrations exist yet (this is the first schema version).
  // Future phases: if (data.schemaVersion < 2) data = migrateV1ToV2(data);
  if (data.schemaVersion > SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${data.schemaVersion}`);
  }
  return { ...data, schemaVersion: SCHEMA_VERSION };
}

function freshSeed() {
  const clone = structuredClone(seedAppData);
  clone.updatedAt = new Date().toISOString();
  return clone;
}

export function loadAppData() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[ai-lexicon] localStorage unavailable, using seed data.', err);
    return freshSeed();
  }
  if (!raw) return freshSeed();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn('[ai-lexicon] stored data was not valid JSON, falling back to seed data.', err);
    return freshSeed();
  }

  if (!isValidAppData(parsed)) {
    console.warn('[ai-lexicon] stored data failed shape validation, falling back to seed data.');
    return freshSeed();
  }

  try {
    return migrateAppData(parsed);
  } catch (err) {
    console.warn('[ai-lexicon] stored data could not be migrated, falling back to seed data.', err);
    return freshSeed();
  }
}

export function saveAppData(appData) {
  try {
    const toStore = { ...appData, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    return true;
  } catch (err) {
    console.error('[ai-lexicon] failed to save app data.', err);
    return false;
  }
}

export function resetAppData() {
  const fresh = freshSeed();
  saveAppData(fresh);
  return fresh;
}

export function exportAppData(appData) {
  // Placeholder for Phase 4: currently a plain JSON snapshot with no
  // format options or download-to-file wiring.
  return JSON.stringify(appData, null, 2);
}

export function importAppData(jsonString) {
  // Placeholder for Phase 4: validates + migrates, but does not persist
  // automatically and has no merge/conflict resolution yet.
  const parsed = JSON.parse(jsonString);
  if (!isValidAppData(parsed)) {
    throw new Error('Imported data failed shape validation.');
  }
  return migrateAppData(parsed);
}
