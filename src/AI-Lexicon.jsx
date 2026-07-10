import { useMemo, useState } from 'react';
import { Search, RotateCcw, Archive } from 'lucide-react';
import { useAppData } from './hooks/useAppData.js';
import Sidebar from './components/Sidebar.jsx';
import SectionGroup from './components/SectionGroup.jsx';
import SectionForm from './components/SectionForm.jsx';
import CardForm from './components/CardForm.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';

function cardMatchesQuery(card, query) {
  if (!query) return true;
  const haystack = [card.title, card.content, card.prompt, card.notes, ...(card.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('execCommand copy failed');
}

export default function AILexicon() {
  const {
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
  } = useAppData();

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [modal, setModal] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  const visibleSections = useMemo(
    () =>
      appData.sections
        .filter((s) => showArchived || !s.archived)
        .sort((a, b) => a.order - b.order),
    [appData.sections, showArchived]
  );

  const sectionsToRender = useMemo(() => {
    const scoped = selectedSectionId ? visibleSections.filter((s) => s.id === selectedSectionId) : visibleSections;
    return scoped
      .map((section) => ({
        ...section,
        cards: section.cards.filter((c) => (showArchived || !c.archived) && cardMatchesQuery(c, query)),
      }))
      .filter((section) => section.cards.length > 0 || !query);
  }, [visibleSections, selectedSectionId, query, showArchived]);

  function toggleExpanded(cardId) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  async function handleCopy(card) {
    const text = card.prompt || card.content || '';
    try {
      await copyText(text);
      recordCopy(card.id);
      setCopiedId(card.id);
      setTimeout(() => setCopiedId((id) => (id === card.id ? null : id)), 1500);
    } catch (err) {
      console.error('[ai-lexicon] copy failed', err);
    }
  }

  function requestReset() {
    setConfirmState({
      title: 'Reset All Data',
      message: 'Reset all data back to the starter content? This cannot be undone.',
      confirmLabel: 'Reset',
      onConfirm: () => {
        resetToSeed();
        setConfirmState(null);
      },
    });
  }

  function submitSectionForm(values) {
    if (modal.mode === 'add') addSection(values);
    else editSection(modal.section.id, values);
    setModal(null);
  }

  function requestDeleteSection(section) {
    const count = section.cards.length;
    setConfirmState({
      title: 'Delete Section',
      message: `Delete "${section.title}" and its ${count} card${count === 1 ? '' : 's'} permanently? This cannot be undone.`,
      onConfirm: () => {
        removeSection(section.id);
        if (selectedSectionId === section.id) setSelectedSectionId(null);
        setConfirmState(null);
      },
    });
  }

  function submitCardForm(values) {
    if (modal.mode === 'add') addCard(modal.sectionId, values);
    else editCard(modal.sectionId, modal.card.id, values);
    setModal(null);
  }

  function requestDeleteCard(sectionId, card) {
    setConfirmState({
      title: 'Delete Card',
      message: `Delete "${card.title}" permanently? This cannot be undone.`,
      onConfirm: () => {
        removeCard(sectionId, card.id);
        setConfirmState(null);
      },
    });
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h1 className="text-base font-semibold leading-tight">AI Lexicon</h1>
          <p className="text-xs leading-tight text-slate-500">
            A working vocabulary for faster, smarter AI collaboration
          </p>
        </div>
        <div className="relative ml-4 max-w-md flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, notes, tags..."
            aria-label="Search cards"
            className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          aria-pressed={showArchived}
          title={showArchived ? 'Hide archived items' : 'Show archived items'}
          className={`ml-auto flex items-center gap-1 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400 ${
            showArchived ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          Archived
        </button>
        <button
          type="button"
          onClick={requestReset}
          title="Reset to starter data"
          aria-label="Reset to starter data"
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sections={visibleSections}
          selectedSectionId={selectedSectionId}
          onSelect={setSelectedSectionId}
          onAddSection={() => setModal({ type: 'section', mode: 'add' })}
          onEditSection={(section) => setModal({ type: 'section', mode: 'edit', section })}
          onArchiveSection={(section) => archiveSection(section.id, !section.archived)}
          onDeleteSection={requestDeleteSection}
        />

        <main className="flex-1 overflow-y-auto p-4">
          {appData.sections.length === 0 && (
            <p className="text-sm text-slate-500">No sections yet. Use the + button in the sidebar to add one.</p>
          )}
          {appData.sections.length > 0 && sectionsToRender.length === 0 && (
            <p className="text-sm text-slate-500">No cards match your search.</p>
          )}
          {sectionsToRender.map((section) => (
            <SectionGroup
              key={section.id}
              section={section}
              expandedIds={expandedIds}
              copiedId={copiedId}
              onToggleCard={toggleExpanded}
              onCopyCard={handleCopy}
              onEditCard={(sectionId, card) => setModal({ type: 'card', mode: 'edit', sectionId, card })}
              onDuplicateCard={(sectionId, card) => cloneCard(sectionId, card.id)}
              onArchiveCard={(sectionId, card) => archiveCard(sectionId, card.id, !card.archived)}
              onDeleteCard={(sectionId, card) => requestDeleteCard(sectionId, card)}
              onAddCard={(sectionId) => setModal({ type: 'card', mode: 'add', sectionId })}
            />
          ))}
        </main>
      </div>

      {modal?.type === 'section' && (
        <SectionForm
          initial={modal.mode === 'edit' ? modal.section : null}
          onSubmit={submitSectionForm}
          onCancel={() => setModal(null)}
        />
      )}

      {modal?.type === 'card' && (
        <CardForm
          initial={modal.mode === 'edit' ? modal.card : null}
          onSubmit={submitCardForm}
          onCancel={() => setModal(null)}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}
