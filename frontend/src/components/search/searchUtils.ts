export const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'for', 'of', 'to', 'in', 'and', 'with', 'on', 'at', 'by', 'from', 'as'
]);

export const getHighlightKeywords = (searchQuery: string | null): string[] => {
  if (!searchQuery) return [];
  return searchQuery
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
};

export const extractKeywords = (title: string, description: string): string[] => {
  const combined = `${title} ${description}`.replace(/[^\w\s-]/g, ' ');
  const words = combined.split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w.toLowerCase()));
  
  // Prioritize uppercase acronyms (like UPSC, IAS)
  const acronyms = words.filter(w => w === w.toUpperCase() && w.match(/[A-Z]/));
  
  // Then get capitalized words (like Central, Civil, Services)
  const capitalized = words.filter(w => w[0] === w[0].toUpperCase() && !acronyms.includes(w));
  
  // Deduplicate and return top 3-4
  const tags = Array.from(new Set([...acronyms, ...capitalized]));
  return tags.slice(0, 4);
};
