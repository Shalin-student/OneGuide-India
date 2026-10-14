import React from 'react';
import { X } from 'lucide-react';

interface ActiveFilterChipsProps {
  filters: Record<string, string>;
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll
}) => {
  const activeKeys = Object.keys(filters).filter(k => 
    k !== 'search' && k !== 'page' && k !== 'limit' && k !== 'sort' && filters[k] !== '' && filters[k] !== 'All'
  );

  if (activeKeys.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {activeKeys.map((key) => {
        let displayValue = filters[key];
        if (displayValue === 'true') displayValue = 'Yes';
        if (displayValue === 'false') displayValue = 'No';

        return (
          <div
            key={key}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold border border-primary-100"
          >
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            <span className="text-primary-900">{displayValue}</span>
            <button
              onClick={() => onRemove(key)}
              className="ml-1 text-primary-400 hover:text-primary-700 transition-colors focus:outline-none"
              aria-label={`Remove filter ${key}`}
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        );
      })}
      
      {activeKeys.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors underline decoration-slate-300 underline-offset-4 ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
