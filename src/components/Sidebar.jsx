import { Folder, Plus, Pencil, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { getSectionIcon } from '../lib/iconMap.js';

const rowActionClass =
  'rounded p-1 focus:outline-none focus:ring-2 focus:ring-slate-400 hover:bg-slate-200 text-slate-400 hover:text-slate-600';
const rowActionClassActive =
  'rounded p-1 focus:outline-none focus:ring-2 focus:ring-white text-white/70 hover:bg-white/10 hover:text-white';

export default function Sidebar({
  sections,
  selectedSectionId,
  onSelect,
  onAddSection,
  onEditSection,
  onArchiveSection,
  onDeleteSection,
}) {
  return (
    <nav aria-label="Sections" className="w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-2">
      <div className="mb-1 flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sections</span>
        <button
          type="button"
          onClick={onAddSection}
          aria-label="Add section"
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
          selectedSectionId === null ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <Folder className="h-4 w-4" />
        All Sections
      </button>

      {sections.map((section) => {
        const Icon = getSectionIcon(section.iconKey);
        const active = selectedSectionId === section.id;
        return (
          <div
            key={section.id}
            className={`group mb-1 flex items-center rounded-md ${active ? 'bg-slate-900' : 'hover:bg-slate-100'}`}
          >
            <button
              type="button"
              onClick={() => onSelect(section.id)}
              className={`flex flex-1 items-center gap-2 overflow-hidden px-2 py-1.5 text-left text-sm ${
                active ? 'text-white' : 'text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{section.title}</span>
              {section.archived && (
                <span className={`shrink-0 rounded px-1 text-[10px] ${active ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                  archived
                </span>
              )}
            </button>
            <div className="flex shrink-0 items-center gap-0.5 pr-1 opacity-0 focus-within:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => onEditSection(section)}
                aria-label={`Edit ${section.title}`}
                className={active ? rowActionClassActive : rowActionClass}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onArchiveSection(section)}
                aria-label={`${section.archived ? 'Unarchive' : 'Archive'} ${section.title}`}
                className={active ? rowActionClassActive : rowActionClass}
              >
                {section.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onDeleteSection(section)}
                aria-label={`Delete ${section.title}`}
                className={active ? rowActionClassActive : rowActionClass}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
