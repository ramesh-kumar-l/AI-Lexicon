import { useState } from 'react';
import Modal from './Modal.jsx';
import { validateSectionInput } from '../lib/validation.js';
import { ICON_OPTIONS } from '../lib/iconMap.js';
import { COLOR_OPTIONS } from '../lib/colorMap.js';

const fieldClass =
  'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function SectionForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [iconKey, setIconKey] = useState(initial?.iconKey || ICON_OPTIONS[0].key);
  const [color, setColor] = useState(initial?.color || COLOR_OPTIONS[0].key);
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const { valid, errors: nextErrors } = validateSectionInput({ title, description });
    if (!valid) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ title, description, iconKey, color });
  }

  return (
    <Modal title={initial ? 'Edit Section' : 'Add Section'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          {errors.title && <span className="mt-1 block text-xs text-rose-600">{errors.title}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={fieldClass}
          />
          {errors.description && <span className="mt-1 block text-xs text-rose-600">{errors.description}</span>}
        </label>
        <div className="flex gap-3">
          <label className="flex-1 text-sm">
            <span className="mb-1 block font-medium text-slate-700">Icon</span>
            <select value={iconKey} onChange={(e) => setIconKey(e.target.value)} className={fieldClass}>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1 block font-medium text-slate-700">Color</span>
            <select value={color} onChange={(e) => setColor(e.target.value)} className={fieldClass}>
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {initial ? 'Save Changes' : 'Add Section'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
