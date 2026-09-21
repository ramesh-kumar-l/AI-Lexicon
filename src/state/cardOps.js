import { generateId } from '../lib/id.js';

function touchSection(appData, sectionId, mapCards) {
  const now = new Date().toISOString();
  return {
    ...appData,
    sections: appData.sections.map((s) =>
      s.id === sectionId ? { ...s, updatedAt: now, cards: mapCards(s.cards, now) } : s
    ),
  };
}

export function createCard(appData, sectionId, { title, content, prompt, notes, tags }) {
  return touchSection(appData, sectionId, (cards, now) => [
    ...cards,
    {
      id: generateId('card'),
      sectionId,
      title: title.trim(),
      content: content.trim(),
      prompt: (prompt || '').trim(),
      notes: (notes || '').trim(),
      tags: tags || [],
      favorite: false,
      archived: false,
      copyCount: 0,
      lastCopiedAt: null,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export function updateCard(appData, sectionId, cardId, { title, content, prompt, notes, tags }) {
  return touchSection(appData, sectionId, (cards, now) =>
    cards.map((c) =>
      c.id === cardId
        ? {
            ...c,
            title: title.trim(),
            content: content.trim(),
            prompt: (prompt || '').trim(),
            notes: (notes || '').trim(),
            tags: tags || [],
            updatedAt: now,
          }
        : c
    )
  );
}

export function duplicateCard(appData, sectionId, cardId) {
  return touchSection(appData, sectionId, (cards, now) => {
    const index = cards.findIndex((c) => c.id === cardId);
    if (index === -1) return cards;
    const copy = {
      ...cards[index],
      id: generateId('card'),
      title: `${cards[index].title} (Copy)`,
      favorite: false,
      copyCount: 0,
      lastCopiedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    return [...cards.slice(0, index + 1), copy, ...cards.slice(index + 1)];
  });
}

export function setCardArchived(appData, sectionId, cardId, archived) {
  return touchSection(appData, sectionId, (cards, now) =>
    cards.map((c) => (c.id === cardId ? { ...c, archived, updatedAt: now } : c))
  );
}

export function deleteCard(appData, sectionId, cardId) {
  return touchSection(appData, sectionId, (cards) => cards.filter((c) => c.id !== cardId));
}

export function recordCardCopy(appData, cardId) {
  const now = new Date().toISOString();
  return {
    ...appData,
    sections: appData.sections.map((section) =>
      section.cards.some((c) => c.id === cardId)
        ? {
            ...section,
            updatedAt: now,
            cards: section.cards.map((c) =>
              c.id === cardId ? { ...c, copyCount: c.copyCount + 1, lastCopiedAt: now, updatedAt: now } : c
            ),
          }
        : section
    ),
  };
}
