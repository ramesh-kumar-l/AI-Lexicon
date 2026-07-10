const MAX_SECTION_TITLE = 80;
const MAX_CARD_TITLE = 120;
const MAX_DESCRIPTION = 300;

export function validateSectionInput({ title, description }) {
  const errors = {};
  const trimmedTitle = (title || '').trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length > MAX_SECTION_TITLE) {
    errors.title = `Title must be ${MAX_SECTION_TITLE} characters or fewer.`;
  }
  if ((description || '').length > MAX_DESCRIPTION) {
    errors.description = `Description must be ${MAX_DESCRIPTION} characters or fewer.`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateCardInput({ title, content }) {
  const errors = {};
  const trimmedTitle = (title || '').trim();
  const trimmedContent = (content || '').trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length > MAX_CARD_TITLE) {
    errors.title = `Title must be ${MAX_CARD_TITLE} characters or fewer.`;
  }
  if (!trimmedContent) {
    errors.content = 'Description is required.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function parseTags(input) {
  if (!input) return [];
  return [...new Set(input.split(',').map((t) => t.trim()).filter(Boolean))];
}
