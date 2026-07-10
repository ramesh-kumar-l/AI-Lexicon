import { Plus } from 'lucide-react';
import CardItem from './CardItem.jsx';
import { getColorClasses } from '../lib/colorMap.js';

export default function SectionGroup({
  section,
  expandedIds,
  copiedId,
  onToggleCard,
  onCopyCard,
  onEditCard,
  onDuplicateCard,
  onArchiveCard,
  onDeleteCard,
  onAddCard,
}) {
  const colors = getColorClasses(section.color);
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-600">
          {section.title}
          {section.archived && (
            <span className="ml-2 rounded bg-slate-100 px-1 text-[10px] font-normal text-slate-500">archived</span>
          )}
        </h2>
        <button
          type="button"
          onClick={() => onAddCard(section.id)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Card
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {section.cards.length === 0 && <p className="text-xs text-slate-400">No cards in this section yet.</p>}
        {section.cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            colors={colors}
            expanded={expandedIds.has(card.id)}
            copied={copiedId === card.id}
            onToggle={onToggleCard}
            onCopy={onCopyCard}
            onEdit={(c) => onEditCard(section.id, c)}
            onDuplicate={(c) => onDuplicateCard(section.id, c)}
            onArchiveToggle={(c) => onArchiveCard(section.id, c)}
            onDelete={(c) => onDeleteCard(section.id, c)}
          />
        ))}
      </div>
    </section>
  );
}
