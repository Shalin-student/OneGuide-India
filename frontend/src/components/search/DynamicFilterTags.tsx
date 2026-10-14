import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Tag as TagIcon } from 'lucide-react';
import { getHighlightKeywords } from './searchUtils';

interface Tag {
  id: string;
  type: 'module' | 'state' | 'search';
  label: string;
  value: string;
}

export const DynamicFilterTags: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tags = useMemo(() => {
    const activeTags: Tag[] = [];
    const module = searchParams.get('category');
    const state = searchParams.get('state');
    const search = searchParams.get('search');

    if (module) {
      activeTags.push({ id: `module-${module}`, type: 'module', label: module, value: module });
    }
    if (state && state !== 'All India') {
      activeTags.push({ id: `state-${state}`, type: 'state', label: state, value: state });
    }
    
    // We could extract keywords as tags, but search is free-form. 
    // To meet "Scholarships [x] Gujarat [x] student [x]", we will add keywords as individual tags.
    const keywords = getHighlightKeywords(search);
    keywords.forEach(kw => {
      // Avoid duplicate tags if it somehow matches a module/state directly 
      // (though they should be removed from search in an NLP setting, here we just show it)
      const existing = activeTags.find(t => t.label.toLowerCase() === kw.toLowerCase());
      if (!existing) {
        activeTags.push({ id: `search-${kw}`, type: 'search', label: kw, value: kw });
      }
    });

    return activeTags;
  }, [searchParams]);

  const removeTag = (tag: Tag) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (tag.type === 'module') newParams.delete('category');
    if (tag.type === 'state') newParams.delete('state');
    if (tag.type === 'search') {
      // Reconstruct search without this keyword
      const search = newParams.get('search') || '';
      const newSearch = search
        .split(/\s+/)
        .filter(w => w.toLowerCase() !== tag.value.toLowerCase())
        .join(' ')
        .trim();
        
      if (newSearch) {
        newParams.set('search', newSearch);
      } else {
        newParams.delete('search');
      }
    }
    
    // reset to page 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAll = () => {
    setSearchParams({});
  };

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4" aria-label="Active filters">
      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mr-2">
        <TagIcon size={16} />
        <span>Active Filters:</span>
      </div>
      
      {tags.map(tag => (
        <div 
          key={tag.id}
          className="inline-flex items-center bg-white border border-slate-200 rounded-full pl-3 pr-1 py-1 text-[13px] font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300"
        >
          <span className="mr-2">
            {tag.type === 'module' && <span className="text-slate-400 font-normal mr-1">Module:</span>}
            {tag.type === 'state' && <span className="text-slate-400 font-normal mr-1">State:</span>}
            {tag.label}
          </span>
          <button
            onClick={() => removeTag(tag)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-1 transition-colors"
            aria-label={`Remove ${tag.label} filter`}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      
      {tags.length > 1 && (
        <button
          onClick={clearAll}
          className="text-[13px] text-indigo-600 hover:text-indigo-800 font-bold ml-2 focus:outline-none hover:underline rounded-md px-2 py-1"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
