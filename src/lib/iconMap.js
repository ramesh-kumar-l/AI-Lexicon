import { Bug, GitPullRequest, FlaskConical, Layers, Sparkles, Folder } from 'lucide-react';

const ICONS = {
  bug: Bug,
  'git-pull-request': GitPullRequest,
  'flask-conical': FlaskConical,
  layers: Layers,
  sparkles: Sparkles,
};

export function getSectionIcon(iconKey) {
  return ICONS[iconKey] || Folder;
}
