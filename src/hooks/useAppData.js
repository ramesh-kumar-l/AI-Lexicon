import { useCallback, useState } from 'react';
import { loadAppData, saveAppData, resetAppData } from '../storage/localStorageAdapter.js';
import { createSection, updateSection, setSectionArchived, deleteSection } from '../state/sectionOps.js';
import {
  createCard,
  updateCard,
  duplicateCard,
  setCardArchived,
  deleteCard,
  recordCardCopy,
} from '../state/cardOps.js';

export function useAppData() {
  const [appData, setAppData] = useState(() => loadAppData());

  const apply = useCallback((updater) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  }, []);

  const recordCopy = useCallback((cardId) => apply((prev) => recordCardCopy(prev, cardId)), [apply]);
  const resetToSeed = useCallback(() => setAppData(resetAppData()), []);

  const addSection = useCallback((values) => apply((prev) => createSection(prev, values)), [apply]);
  const editSection = useCallback(
    (sectionId, values) => apply((prev) => updateSection(prev, sectionId, values)),
    [apply]
  );
  const archiveSection = useCallback(
    (sectionId, archived) => apply((prev) => setSectionArchived(prev, sectionId, archived)),
    [apply]
  );
  const removeSection = useCallback((sectionId) => apply((prev) => deleteSection(prev, sectionId)), [apply]);

  const addCard = useCallback(
    (sectionId, values) => apply((prev) => createCard(prev, sectionId, values)),
    [apply]
  );
  const editCard = useCallback(
    (sectionId, cardId, values) => apply((prev) => updateCard(prev, sectionId, cardId, values)),
    [apply]
  );
  const cloneCard = useCallback(
    (sectionId, cardId) => apply((prev) => duplicateCard(prev, sectionId, cardId)),
    [apply]
  );
  const archiveCard = useCallback(
    (sectionId, cardId, archived) => apply((prev) => setCardArchived(prev, sectionId, cardId, archived)),
    [apply]
  );
  const removeCard = useCallback(
    (sectionId, cardId) => apply((prev) => deleteCard(prev, sectionId, cardId)),
    [apply]
  );

  return {
    appData,
    recordCopy,
    resetToSeed,
    addSection,
    editSection,
    archiveSection,
    removeSection,
    addCard,
    editCard,
    cloneCard,
    archiveCard,
    removeCard,
  };
}
