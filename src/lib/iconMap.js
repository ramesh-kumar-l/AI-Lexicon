import {
  Bug,
  GitPullRequest,
  FlaskConical,
  Layers,
  Sparkles,
  Folder,
  BookOpen,
  Lightbulb,
  Target,
  Wrench,
} from 'lucide-react';

const ICONS = {
  bug: Bug,
  'git-pull-request': GitPullRequest,
  'flask-conical': FlaskConical,
  layers: Layers,
  sparkles: Sparkles,
  folder: Folder,
  'book-open': BookOpen,
  lightbulb: Lightbulb,
  target: Target,
  wrench: Wrench,
};

export const ICON_OPTIONS = [
  { key: 'bug', label: 'Bug' },
  { key: 'git-pull-request', label: 'Pull Request' },
  { key: 'flask-conical', label: 'Flask' },
  { key: 'layers', label: 'Layers' },
  { key: 'sparkles', label: 'Sparkles' },
  { key: 'folder', label: 'Folder' },
  { key: 'book-open', label: 'Book' },
  { key: 'lightbulb', label: 'Idea' },
  { key: 'target', label: 'Target' },
  { key: 'wrench', label: 'Wrench' },
];

export function getSectionIcon(iconKey) {
  return ICONS[iconKey] || Folder;
}
