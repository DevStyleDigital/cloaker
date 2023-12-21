export function sanitizeSearchText(text: string) {
  const sanitizedText = text.replace(/[^a-zA-Z0-9%&-]/g, '');
  return sanitizedText;
}
