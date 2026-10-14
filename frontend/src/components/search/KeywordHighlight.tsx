import React, { useMemo } from 'react';

interface Props {
  text: string;
  keywords?: string[];
}

export const KeywordHighlight: React.FC<Props> = ({ text, keywords = [] }) => {
  const parts = useMemo(() => {
    if (!text || keywords.length === 0) return [{ text, highlight: false }];

    // Escape regex special chars from keywords
    const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Create a capturing regex that splits the string while preserving the matched terms
    const pattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    
    const tokens = text.split(pattern);
    
    // Every odd index in the resulting array will be a matched keyword
    // However, pattern.test() is stateful if 'g' is used, so we use string match check or just index logic
    // Actually, pattern.test() is fine if we re-instantiate, but using regex to match token is safer:
    const checkPattern = new RegExp(`^(${escapedKeywords.join('|')})$`, 'i');
    
    return tokens.map(token => ({
      text: token,
      highlight: checkPattern.test(token)
    }));
  }, [text, keywords]);

  if (!keywords || keywords.length === 0 || !text) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => 
        part.highlight ? (
          <mark key={i} className="bg-amber-200 text-inherit px-0.5 rounded-sm">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
};
