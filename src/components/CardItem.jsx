import { ChevronDown, ChevronRight, Copy, Check, Pencil, Files, Archive, ArchiveRestore, Trash2 } from 'lucide-react';

const actionClass =
  'rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function CardItem({ card, colors, expanded, copied, onToggle, onCopy, onEdit, onDuplicate, onArchiveToggle, onDelete }) {
  return (
    <article
      className={`rounded-lg border border-l-4 border-slate-200 bg-white p-3 ${colors.accent} ${
        card.archived ? 'opacity-60' : ''
      }`}
    >
      <div className="group flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggle(card.id)}
          aria-expanded={expanded}
          className="flex flex-1 items-start gap-2 text-left focus:outline-none"
        >
          {expanded ? (
            <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          ) : (
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          )}
          <div>
            <h3 className="text-sm font-medium">
              {card.title}
              {card.archived && (
                <span className="ml-2 rounded bg-slate-100 px-1 text-[10px] text-slate-500">archived</span>
              )}
            </h3>
            {!expanded && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{card.content}</p>}
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 focus-within:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
          <button type="button" onClick={() => onEdit(card)} aria-label={`Edit ${card.title}`} className={actionClass}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(card)}
            aria-label={`Duplicate ${card.title}`}
            className={actionClass}
          >
            <Files className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onArchiveToggle(card)}
            aria-label={`${card.archived ? 'Unarchive' : 'Archive'} ${card.title}`}
            className={actionClass}
          >
            {card.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(card)}
            aria-label={`Delete ${card.title}`}
            className={`${actionClass} hover:text-rose-600`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-700">{card.content}</p>

          {card.prompt && (
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Prompt</span>
                <button
                  type="button"
                  onClick={() => onCopy(card)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {copied ? (
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
}
