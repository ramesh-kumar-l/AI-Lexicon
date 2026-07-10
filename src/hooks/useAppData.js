import { useCallback, useState } from 'react';
import { loadAppData, saveAppData, resetAppData } from '../storage/localStorageAdapter.js';

export function useAppData() {
  const [appData, setAppData] = useState(() => loadAppData());

  const recordCopy = useCallback((cardId) => {
    setAppData((prev) => {
      const now = new Date().toISOString();
      const next = {
        ...prev,
        sections: prev.sections.map((section) =>
          section.cards.some((c) => c.id === cardId)
            ? {
                ...section,
                updatedAt: now,
                cards: section.cards.map((c) =>
                  c.id === cardId
                    ? { ...c, copyCount: c.copyCount + 1, lastCopiedAt: now, updatedAt: now }
                    : c
                ),
              }
            : section
        ),
      };
      saveAppData(next);
      return next;
    });
  }, []);

  const resetToSeed = useCallback(() => {
    setAppData(resetAppData());
  }, []);

  return { appData, recordCopy, resetToSeed };
}
