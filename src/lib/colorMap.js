const COLOR_CLASSES = {
  rose: { accent: 'border-rose-500', chip: 'bg-rose-50 text-rose-700' },
  blue: { accent: 'border-blue-500', chip: 'bg-blue-50 text-blue-700' },
  green: { accent: 'border-green-500', chip: 'bg-green-50 text-green-700' },
  amber: { accent: 'border-amber-500', chip: 'bg-amber-50 text-amber-700' },
  purple: { accent: 'border-purple-500', chip: 'bg-purple-50 text-purple-700' },
  teal: { accent: 'border-teal-500', chip: 'bg-teal-50 text-teal-700' },
  indigo: { accent: 'border-indigo-500', chip: 'bg-indigo-50 text-indigo-700' },
  slate: { accent: 'border-slate-400', chip: 'bg-slate-100 text-slate-700' },
};

export const COLOR_OPTIONS = [
  { key: 'rose', label: 'Rose' },
  { key: 'blue', label: 'Blue' },
  { key: 'green', label: 'Green' },
  { key: 'amber', label: 'Amber' },
  { key: 'purple', label: 'Purple' },
  { key: 'teal', label: 'Teal' },
  { key: 'indigo', label: 'Indigo' },
  { key: 'slate', label: 'Slate' },
];

export function getColorClasses(color) {
  return COLOR_CLASSES[color] || COLOR_CLASSES.slate;
}
