import { useState } from 'react';
import Modal from './Modal.jsx';
import { validateCardInput, parseTags } from '../lib/validation.js';

const fieldClass =
  'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400';

export default function CardForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [prompt, setPrompt] = useState(initial?.prompt || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(', '));
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const { valid, errors: nextErrors } = validateCardInput({ title, content });
    if (!valid) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ title, content, prompt, notes, tags: parseTags(tagsInput) });
  }

  return (
    <Modal title={initial ? 'Edit Card' : 'Add Card'} onClose={onCancel}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          {errors.title && <span className="mt-1 block text-xs text-rose-600">{errors.title}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Description</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={2} className={fieldClass} />
          {errors.content && <span className="mt-1 block text-xs text-rose-600">{errors.content}</span>}
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className={`${fieldClass} font-mono text-xs`}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Notes</span>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className={fieldClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Tags (comma separated)</span>
          <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={fieldClass} />
        </label>
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
            {initial ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
