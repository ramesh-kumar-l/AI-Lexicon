const COLOR_CLASSES = {
  rose: { accent: 'border-rose-500', chip: 'bg-rose-50 text-rose-700' },
  blue: { accent: 'border-blue-500', chip: 'bg-blue-50 text-blue-700' },
  green: { accent: 'border-green-500', chip: 'bg-green-50 text-green-700' },
  amber: { accent: 'border-amber-500', chip: 'bg-amber-50 text-amber-700' },
  purple: { accent: 'border-purple-500', chip: 'bg-purple-50 text-purple-700' },
};

export function getColorClasses(color) {
  return COLOR_CLASSES[color] || { accent: 'border-slate-400', chip: 'bg-slate-100 text-slate-700' };
}
