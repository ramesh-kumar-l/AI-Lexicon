import { generateId } from '../lib/id.js';

export function createSection(appData, { title, description, iconKey, color }) {
  const now = new Date().toISOString();
  const maxOrder = appData.sections.reduce((max, s) => Math.max(max, s.order), -1);
  const newSection = {
    id: generateId('sec'),
    title: title.trim(),
    description: (description || '').trim(),
    iconKey,
    color,
    order: maxOrder + 1,
    archived: false,
    createdAt: now,
    updatedAt: now,
    cards: [],
  };
  return { ...appData, sections: [...appData.sections, newSection] };
}

export function updateSection(appData, sectionId, { title, description, iconKey, color }) {
  const now = new Date().toISOString();
  return {
    ...appData,
    sections: appData.sections.map((s) =>
      s.id === sectionId
        ? { ...s, title: title.trim(), description: (description || '').trim(), iconKey, color, updatedAt: now }
        : s
    ),
  };
}

export function setSectionArchived(appData, sectionId, archived) {
  const now = new Date().toISOString();
  return {
    ...appData,
    sections: appData.sections.map((s) => (s.id === sectionId ? { ...s, archived, updatedAt: now } : s)),
  };
}

export function deleteSection(appData, sectionId) {
  return { ...appData, sections: appData.sections.filter((s) => s.id !== sectionId) };
}
