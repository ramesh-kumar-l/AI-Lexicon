import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronRight, Copy, Check, RotateCcw, Folder } from 'lucide-react';
import { useAppData } from './hooks/useAppData.js';
import { getSectionIcon } from './lib/iconMap.js';
import { getColorClasses } from './lib/colorMap.js';

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
  const { appData, recordCopy, resetToSeed } = useAppData();
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);

  const visibleSections = useMemo(
    () => appData.sections.filter((s) => !s.archived).sort((a, b) => a.order - b.order),
    [appData.sections]
  );

  const sectionsToRender = useMemo(() => {
    const scoped = selectedSectionId
      ? visibleSections.filter((s) => s.id === selectedSectionId)
      : visibleSections;
    return scoped
      .map((section) => ({
        ...section,
        cards: section.cards.filter((c) => !c.archived && cardMatchesQuery(c, query)),
      }))
      .filter((section) => section.cards.length > 0 || !query);
  }, [visibleSections, selectedSectionId, query]);

  function toggleExpanded(cardId) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
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

  function handleReset() {
    if (window.confirm('Reset all data back to the starter content? This cannot be undone.')) {
      resetToSeed();
    }
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
          onClick={handleReset}
          title="Reset to starter data"
          aria-label="Reset to starter data"
          className="ml-auto rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav aria-label="Sections" className="w-56 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-2">
          <button
            type="button"
            onClick={() => setSelectedSectionId(null)}
            className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
              selectedSectionId === null ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Folder className="h-4 w-4" />
            All Sections
          </button>
          {visibleSections.map((section) => {
            const Icon = getSectionIcon(section.iconKey);
            const active = selectedSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedSectionId(section.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
                  active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{section.title}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-4">
          {sectionsToRender.length === 0 && (
            <p className="text-sm text-slate-500">No cards match your search.</p>
          )}
          {sectionsToRender.map((section) => (
            <section key={section.id} className="mb-6">
              <h2 className="mb-2 text-sm font-semibold text-slate-600">{section.title}</h2>
              <div className="flex flex-col gap-2">
                {section.cards.map((card) => {
                  const expanded = expandedIds.has(card.id);
                  const colors = getColorClasses(section.color);
                  return (
                    <article
                      key={card.id}
                      className={`rounded-lg border border-l-4 border-slate-200 bg-white p-3 ${colors.accent}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpanded(card.id)}
                        aria-expanded={expanded}
                        className="flex w-full items-start justify-between gap-2 text-left focus:outline-none"
                      >
                        <div>
                          <h3 className="text-sm font-medium">{card.title}</h3>
                          {!expanded && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{card.content}</p>
                          )}
                        </div>
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </button>

                      {expanded && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <p className="text-sm text-slate-700">{card.content}</p>

                          {card.prompt && (
                            <div className="mt-2">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Prompt
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(card)}
                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                  {copiedId === card.id ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="whitespace-pre-wrap border-l-2 border-slate-200 pl-2 font-mono text-xs text-slate-800">
                                {card.prompt}
                              </pre>
                            </div>
                          )}

                          {card.notes && <p className="mt-2 text-xs italic text-slate-500">{card.notes}</p>}

                          {card.tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {card.tags.map((tag) => (
                                <span key={tag} className={`rounded-md px-1.5 py-0.5 text-[11px] ${colors.chip}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {card.copyCount > 0 && (
                            <p className="mt-2 text-[11px] text-slate-400">
                              Copied {card.copyCount} time{card.copyCount === 1 ? '' : 's'}
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
