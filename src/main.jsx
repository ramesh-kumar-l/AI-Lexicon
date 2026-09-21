import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AILexicon from './AI-Lexicon.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AILexicon />
  </StrictMode>
);
